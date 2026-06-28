import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);
const DELAI_24H_MS = 24 * 60 * 60 * 1000;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as any)?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id } = await params;

  let body: { action: string; newDate?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 });
  }

  const { action, newDate } = body;
  if (!['annuler', 'reprogrammer'].includes(action)) {
    return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!reservation) {
    return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 });
  }

  if (reservation.userId !== (session.user as any).id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
  }

  if (!['EN_ATTENTE', 'CONFIRMEE'].includes(reservation.statut)) {
    return NextResponse.json({ error: 'Cette réservation ne peut plus être modifiée.' }, { status: 400 });
  }

  const now = Date.now();
  const dateRdv = new Date(reservation.dateIntervention).getTime();
  if (dateRdv - now < DELAI_24H_MS) {
    return NextResponse.json({
      error: "Annulation/reprogrammation impossible moins de 24h avant le rendez-vous. Merci de contacter directement DS HY'LEC au 07 77 77 77 87.",
    }, { status: 400 });
  }

  const ancienneDate = new Date(reservation.dateIntervention);
  const client = reservation.user;
  const servicesLabel = (reservation.services.length > 0 ? reservation.services : [reservation.service])
    .map((s: string) => s.replace(/_/g, ' ')).join(' + ');
  const fmt = (d: Date) =>
    `${d.toLocaleDateString('fr-FR')} à ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;

  // ─── ANNULATION ────────────────────────────────────────────────────────────
  if (action === 'annuler') {
    await prisma.reservation.update({ where: { id }, data: { statut: 'ANNULEE' } });

    try {
      await resend.emails.send({
        from: "DS HY'LEC <contact@dshylec.fr>",
        replyTo: 'contact@dshylec.fr',
        to: ['contact@dshylec.fr'],
        subject: `⚠️ Annulation RDV - ${client?.prenom} ${client?.nom}`,
        html: `
          <div style="font-family:sans-serif;color:#333;">
            <h2 style="color:#E30613;">⚠️ Annulation de rendez-vous</h2>
            <p><strong>Client :</strong> ${client?.prenom} ${client?.nom}</p>
            <p><strong>Téléphone :</strong> ${client?.telephone || 'Non renseigné'}</p>
            <p><strong>Prestation(s) :</strong> ${servicesLabel}</p>
            <p><strong>Date annulée :</strong> <span style="color:#E30613;font-weight:bold;">${fmt(ancienneDate)}</span></p>
            <br/>
            <a href="${process.env.NEXTAUTH_URL}/admin" style="display:inline-block;background:#E30613;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">Voir le planning</a>
          </div>
        `,
      });
    } catch (e) {
      console.error('Email annulation non envoyé', e);
    }

    return NextResponse.json({ success: true });
  }

  // ─── REPROGRAMMATION ───────────────────────────────────────────────────────
  if (!newDate) {
    return NextResponse.json({ error: 'Nouvelle date requise' }, { status: 400 });
  }

  const newDateObj = new Date(newDate);
  if (isNaN(newDateObj.getTime())) {
    return NextResponse.json({ error: 'Date invalide' }, { status: 400 });
  }
  if (newDateObj.getTime() - now < DELAI_24H_MS) {
    return NextResponse.json({ error: 'La nouvelle date doit être au moins 24h dans le futur.' }, { status: 400 });
  }

  // Vérification disponibilité — même logique que /api/disponibilites
  const startOfDay = new Date(newDateObj);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(newDateObj);
  endOfDay.setHours(23, 59, 59, 999);
  const newHour = `${newDateObj.getHours().toString().padStart(2, '0')}:${newDateObj.getMinutes().toString().padStart(2, '0')}`;

  const indisponibilites = await prisma.indisponibilite.findMany({
    where: { dateDebut: { lte: endOfDay }, dateFin: { gte: startOfDay } },
  });

  if (indisponibilites.some((i: any) => i.jourEntier)) {
    return NextResponse.json({ error: "Ce créneau n'est pas disponible." }, { status: 400 });
  }

  const adminBlockedSlots = indisponibilites.map((i: any) => {
    const d = new Date(i.dateDebut);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  });

  if (adminBlockedSlots.includes(newHour)) {
    return NextResponse.json({ error: "Ce créneau n'est pas disponible." }, { status: 400 });
  }

  // Exclut la réservation courante du check (elle libère son ancien créneau)
  const existingReservations = await prisma.reservation.findMany({
    where: {
      id: { not: id },
      dateIntervention: { gte: startOfDay, lte: endOfDay },
      statut: { not: 'ANNULEE' },
    },
  });

  const reservedHours = existingReservations.map((r: any) => {
    const d = new Date(r.dateIntervention);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  });

  if (reservedHours.includes(newHour)) {
    return NextResponse.json({ error: 'Ce créneau est déjà réservé.' }, { status: 400 });
  }

  await prisma.reservation.update({
    where: { id },
    data: { dateIntervention: newDateObj, statut: 'EN_ATTENTE' },
  });

  try {
    await resend.emails.send({
      from: "DS HY'LEC <contact@dshylec.fr>",
      replyTo: 'contact@dshylec.fr',
      to: ['contact@dshylec.fr'],
      subject: `🔄 Reprogrammation RDV - ${client?.prenom} ${client?.nom}`,
      html: `
        <div style="font-family:sans-serif;color:#333;">
          <h2 style="color:#F57C00;">🔄 Reprogrammation de rendez-vous</h2>
          <p><strong>Client :</strong> ${client?.prenom} ${client?.nom}</p>
          <p><strong>Téléphone :</strong> ${client?.telephone || 'Non renseigné'}</p>
          <p><strong>Prestation(s) :</strong> ${servicesLabel}</p>
          <p><strong>Ancienne date :</strong> <span style="color:#E30613;">${fmt(ancienneDate)}</span></p>
          <p><strong>Nouvelle date :</strong> <span style="color:#43A047;font-weight:bold;">${fmt(newDateObj)}</span></p>
          <br/>
          <a href="${process.env.NEXTAUTH_URL}/admin" style="display:inline-block;background:#43A047;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">Voir le planning</a>
        </div>
      `,
    });
  } catch (e) {
    console.error('Email reprogrammation non envoyé', e);
  }

  return NextResponse.json({ success: true });
}
