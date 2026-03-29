import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get('date');

  if (!dateParam) {
    return NextResponse.json({ error: "Date manquante" }, { status: 400 });
  }

  try {
    // 1. On définit le début et la fin de la journée demandée
    const targetDate = new Date(dateParam);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    // 2. Vérifier si Sabile a posé un congé/indisponibilité sur cette journée
    const indisponibilites = await prisma.indisponibilite.findMany({
      where: {
        dateDebut: { lte: endOfDay },
        dateFin: { gte: startOfDay },
      }
    });

    if (indisponibilites.length > 0) {
      // S'il y a un congé qui tombe ce jour-là, on renvoie un tableau vide (0 créneaux)
      return NextResponse.json({ slots: [] });
    }

    // 3. Récupérer les réservations existantes pour ce jour précis
    const reservations = await prisma.reservation.findMany({
      where: {
        dateIntervention: {
          gte: startOfDay,
          lte: endOfDay,
        },
        statut: {
          not: 'ANNULEE' // On compte les RDV sauf s'ils ont été annulés
        }
      }
    });

    // 4. On extrait les heures déjà prises au format "HH:mm"
    const reservedHours = reservations.map(r => {
      const d = new Date(r.dateIntervention);
      // On s'assure d'avoir un format propre (ex: "09:00")
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    });

    // 5. Nos créneaux standards par jour (tu peux les modifier ici !)
    const allSlots = ["09:00", "11:00", "14:00", "16:00"];

    // 6. On filtre : on ne garde que les créneaux qui NE SONT PAS dans reservedHours
    const availableSlots = allSlots.filter(slot => !reservedHours.includes(slot));

    return NextResponse.json({ slots: availableSlots });

  } catch (error) {
    console.error("Erreur API disponibilités:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}