import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { WelcomeEmail } from '@/components/emails/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const resultat = await prisma.$transaction(async (tx) => {
      
      // --- 1. GÉNÉRATION DU CODE PARRAIN UNIQUE ---
      const basePrenom = (data.prenom || 'CLIENT').toUpperCase().substring(0, 4).replace(/[^A-Z]/g, '');
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const nouveauCodeParrain = `${basePrenom}-${randomSuffix}`;

      // --- 2. GESTION DE L'UTILISATEUR ---
      const user = await tx.user.upsert({
        where: { email: data.email },
        update: { 
          telephone: data.tel,
          nom: data.nom,
          prenom: data.prenom,
          typeClient: data.typeClient || 'PARTICULIER',
        }, 
        create: {
          email: data.email,
          nom: data.nom || 'Client',
          prenom: data.prenom || 'Nouveau',
          telephone: data.tel,
          motDePasse: "temp_" + Math.random().toString(36).slice(-8),
          codeParrain: nouveauCodeParrain,
          cagnotte: 0, 
          role: 'CLIENT', 
          typeClient: data.typeClient || 'PARTICULIER',
        },
      });

      // --- 3. NOUVEAU : TARIFICATION DYNAMIQUE ---
      // On cherche le prix du service choisi par le client dans la base de données
      const tarifDb = await tx.tarification.findUnique({
        where: { service: data.service }
      });

      // Si Sabile a enregistré un prix, on l'utilise. Sinon, prix par défaut à 89€.
      let prixDeBase = tarifDb ? tarifDb.prix : 89.0;
      let montantFinal = prixDeBase;
      let remise = 0;

      if (data.codeParrainSaisi) {
        const parrain = await tx.user.findUnique({
          where: { codeParrain: data.codeParrainSaisi }
        });

        if (parrain && parrain.email !== data.email) {
          remise = 10.0;
          montantFinal = prixDeBase - remise;

          await tx.parrainage.create({
            data: {
              parrainId: parrain.id,
              filleulEmail: data.email,
              code: data.codeParrainSaisi,
              creditParrain: 10.0,
              remiseFilleul: remise,
              statut: 'EN_ATTENTE',
            }
          });
        }
      }

      // --- 4. CRÉATION DU VÉHICULE ---
      const vehicule = await tx.vehicule.create({
        data: {
          userId: user.id, 
          marque: data.marque,
          modele: data.modele,
          annee: parseInt(data.annee) || new Date().getFullYear(),
          carburant: data.carburant,
          immatriculation: data.immatriculation || null
        },
      });

      // --- 5. CRÉATION DE LA RÉSERVATION ---
      const reservation = await tx.reservation.create({
        data: {
          userId: user.id,        
          vehiculeId: vehicule.id, 
          service: data.service,
          dateIntervention: new Date(data.date),
          adresse: data.adresse,
          moyenPaiement: data.moyenPaiement,
          montantTotal: montantFinal, // <--- Le VRAI prix est injecté ici !
          remiseAppliquee: remise,
          statut: 'EN_ATTENTE',   
          problemes: data.problemes || [],
          notes: `Véhicule: ${data.marque} ${data.modele}`
        },
      });

      return { reservation, user, vehicule, montantFinal, remise };
    });

    // --- EMAILS ---
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?email=${data.email}`;

    try {
      await resend.emails.send({
        from: "DS HY'LEC <onboarding@resend.dev>",
        to: [data.email],
        subject: 'Confirmation de votre réservation ⚡', 
        react: WelcomeEmail({ prenom: data.prenom, resetLink }),
      });

      const problemesText = data.problemes && data.problemes.length > 0 
        ? data.problemes.join(', ') 
        : 'Aucun problème spécifique signalé';

      await resend.emails.send({
        from: "DS HY'LEC <onboarding@resend.dev>",
        to: ['coulibalydavid31@gmail.com'],
        subject: '🚀 Nouveau RDV : ' + data.marque + ' ' + data.modele,
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h2>Nouveau client !</h2>
            <p><strong>Client :</strong> ${data.prenom} ${data.nom} <span style="background:#E30613;color:white;padding:3px 8px;border-radius:12px;font-size:12px;font-weight:bold;margin-left:8px;">${data.typeClient || 'PARTICULIER'}</span></p>
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