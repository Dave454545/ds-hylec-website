import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { WelcomeEmail } from '@/components/emails/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY!);

// ─── Rate limiting (in-memory, resets on server restart) ───────────────────
// 5 requests per IP per hour
const RATE_LIMIT = 5;
const WINDOW_MS  = 60 * 60 * 1000; // 1 hour

const ipMap = new Map<string, { count: number; windowStart: number }>();

function checkRateLimit(ip: string): boolean {
  const now  = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    ipMap.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

// ─── Zod validation schema ──────────────────────────────────────────────────
const ReservationSchema = z.object({
  // Client
  fullName:    z.string().min(2, "Nom requis").max(100),
  nom:         z.string().min(1).max(100).optional(),
  prenom:      z.string().min(1).max(100).optional(),
  tel:         z.string().min(6, "Téléphone invalide").max(20),
  email:       z.string().email("Email invalide"),
  adresse:     z.string().min(5, "Adresse requise").max(300),
  typeClient:  z.enum(['PARTICULIER', 'PROFESSIONNEL']).default('PARTICULIER'),

  // Vehicle
  marque:      z.string().min(1, "Marque requise").max(100),
  modele:      z.string().min(1, "Modèle requis").max(100),
  annee:       z.union([z.string(), z.number()])
                 .transform(v => parseInt(String(v), 10))
                 .refine(v => v >= 1980 && v <= new Date().getFullYear() + 1, "Année invalide"),
  carburant:   z.enum(['ESSENCE', 'DIESEL', 'HYBRIDE', 'ELECTRIQUE']),
  immatriculation: z.string().max(20).optional().nullable(),

  // Service & date
  service:     z.enum([
    'DIAGNOSTIC_ELECTRONIQUE', 'DECALAMINAGE_MOTEUR', 'REGENERATION_FAP',
    'NETTOYAGE_EGR', 'DIAGNOSTIC_HYBRIDE', 'TEST_BATTERIE_HYBRIDE',
    'NETTOYAGE_REFROIDISSEMENT_HYBRIDE', 'PACK_HYBRIDE_COMPLET',
  ]),
  date:        z.string().refine(v => !isNaN(Date.parse(v)), "Date invalide"),
  moyenPaiement: z.enum(['EN_LIGNE', 'SUR_PLACE']).default('SUR_PLACE'),

  // Optional
  problemes:       z.array(z.string().max(100)).max(20).default([]),
  codeParrainSaisi: z.string().max(30).optional().nullable(),
});

// ─── Route handler ──────────────────────────────────────────────────────────
export async function POST(request: Request) {
  // 1. Rate limiting
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez dans une heure." },
      { status: 429 }
    );
  }

  // 2. Parse & validate
  let data: z.infer<typeof ReservationSchema>;
  try {
    const body = await request.json();
    const result = ReservationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    data = result.data;
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  // Derive nom/prenom from fullName if not provided separately
  const names  = (data.fullName ?? '').split(' ');
  const prenom = data.prenom ?? names[0] ?? 'Client';
  const nom    = data.nom    ?? names.slice(1).join(' ') || 'Client';

  try {
    const resultat = await prisma.$transaction(async (tx) => {

      // --- 1. CODE PARRAIN UNIQUE ---
      const basePrenom  = prenom.toUpperCase().substring(0, 4).replace(/[^A-Z]/g, '');
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const nouveauCodeParrain = `${basePrenom}-${randomSuffix}`;

      // --- 2. UTILISATEUR ---
      const user = await tx.user.upsert({
        where:  { email: data.email },
        update: { telephone: data.tel, nom, prenom, typeClient: data.typeClient },
        create: {
          email: data.email,
          nom,
          prenom,
          telephone:   data.tel,
          motDePasse:  "temp_" + Math.random().toString(36).slice(-8),
          codeParrain: nouveauCodeParrain,
          cagnotte:    0,
          role:        'CLIENT',
          typeClient:  data.typeClient,
        },
      });

      // --- 3. TARIFICATION DYNAMIQUE ---
      const tarifDb   = await tx.tarification.findUnique({ where: { service: data.service } });
      let prixDeBase  = tarifDb ? tarifDb.prix : 89.0;
      let montantFinal = prixDeBase;
      let remise       = 0;

      if (data.codeParrainSaisi) {
        const parrain = await tx.user.findUnique({ where: { codeParrain: data.codeParrainSaisi } });
        if (parrain && parrain.email !== data.email) {
          remise       = 10.0;
          montantFinal = prixDeBase - remise;
          await tx.parrainage.create({
            data: {
              parrainId:     parrain.id,
              filleulEmail:  data.email,
              code:          data.codeParrainSaisi,
              creditParrain: 10.0,
              remiseFilleul: remise,
              statut:        'EN_ATTENTE',
            },
          });
        }
      }

      // --- 4. VÉHICULE ---
      const vehicule = await tx.vehicule.create({
        data: {
          userId:         user.id,
          marque:         data.marque,
          modele:         data.modele,
          annee:          data.annee,
          carburant:      data.carburant,
          immatriculation: data.immatriculation ?? null,
        },
      });

      // --- 5. RÉSERVATION ---
      const reservation = await tx.reservation.create({
        data: {
          userId:          user.id,
          vehiculeId:      vehicule.id,
          service:         data.service,
          dateIntervention: new Date(data.date),
          adresse:         data.adresse,
          moyenPaiement:   data.moyenPaiement,
          montantTotal:    montantFinal,
          remiseAppliquee: remise,
          statut:          'EN_ATTENTE',
          problemes:       data.problemes,
          notes:           `Véhicule: ${data.marque} ${data.modele}`,
        },
      });

      return { reservation, user, vehicule, montantFinal, remise };
    });

    // --- EMAILS ---
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?email=${data.email}`;
    try {
      await resend.emails.send({
        from:    "DS HY'LEC <onboarding@resend.dev>",
        to:      [data.email],
        subject: 'Confirmation de votre réservation ⚡',
        react:   WelcomeEmail({ prenom, resetLink }) as any,
      });

      const problemesText = data.problemes.length > 0
        ? data.problemes.join(', ')
        : 'Aucun problème spécifique signalé';

      await resend.emails.send({
        from:    "DS HY'LEC <onboarding@resend.dev>",
        to:      ['coulibalydavid31@gmail.com'],
        subject: '🚀 Nouveau RDV : ' + data.marque + ' ' + data.modele,
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h2>Nouveau client !</h2>
            <p><strong>Client :</strong> ${prenom} ${nom} <span style="background:#E30613;color:white;padding:3px 8px;border-radius:12px;font-size:12px;font-weight:bold;margin-left:8px;">${data.typeClient}</span></p>
            <p><strong>Téléphone :</strong> ${data.tel}</p>
            <p><strong>Prestation :</strong> ${data.service.replace(/_/g, ' ')}</p>
            <p><strong>Véhicule :</strong> ${data.marque} ${data.modele} (${data.carburant})</p>
            <p><strong>Symptômes signalés :</strong> <span style="color:#E30613;font-weight:bold;">${problemesText}</span></p>
            <p><strong>Prix estimé :</strong> <span style="color:#43A047;font-size:18px;font-weight:bold;">${resultat.montantFinal} €</span> ${resultat.remise > 0 ? '(Client parrainé ! -10€)' : ''}</p>
            <p><strong>Lieu :</strong> ${data.adresse}</p>
            <br/>
            <a href="${process.env.NEXTAUTH_URL}/admin" style="display:inline-block;background:#43A047;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">Voir le planning</a>
          </div>
        `,
      });
    } catch (e) {
      console.error("Emails non envoyés", e);
    }

    return NextResponse.json({ success: true, id: resultat.reservation.id });

  } catch (error: any) {
    console.error("❌ Erreur API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
