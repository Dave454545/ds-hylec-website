import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Accepts YYYY-MM-DD or any ISO date string
const QuerySchema = z.object({
  date: z
    .string()
    .min(1, "Paramètre 'date' requis")
    .refine(v => !isNaN(Date.parse(v)), "Format de date invalide (attendu : YYYY-MM-DD)"),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const result = QuerySchema.safeParse({ date: searchParams.get('date') });
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten().fieldErrors.date?.[0] ?? "Paramètre invalide" },
      { status: 400 }
    );
  }

  const { date: dateParam } = result.data;

  try {
    const targetDate = new Date(dateParam);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Vérifier si l'admin a bloqué cette journée
    const indisponibilites = await prisma.indisponibilite.findMany({
      where: {
        dateDebut: { lte: endOfDay },
        dateFin:   { gte: startOfDay },
      },
    });

    if (indisponibilites.length > 0) {
      return NextResponse.json({ slots: [] });
    }

    // Créneaux déjà réservés ce jour
    const reservations = await prisma.reservation.findMany({
      where: {
        dateIntervention: { gte: startOfDay, lte: endOfDay },
        statut: { not: 'ANNULEE' },
      },
    });

    const reservedHours = reservations.map(r => {
      const d = new Date(r.dateIntervention);
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    });

    const allSlots       = ["09:00", "11:00", "14:00", "16:00"];
    const availableSlots = allSlots.filter(slot => !reservedHours.includes(slot));

    return NextResponse.json({ slots: availableSlots });

  } catch (error) {
    console.error("Erreur API disponibilités:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
