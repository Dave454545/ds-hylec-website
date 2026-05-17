import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

function isAdmin(session: any) {
  return session && (session.user as any)?.role === "ADMIN";
}

// --- BLOQUER UNE JOURNÉE OU DES CRÉNEAUX SPÉCIFIQUES ---
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const { date, motif, heures } = await request.json();

    if (!date) {
      return NextResponse.json({ error: "Date requise" }, { status: 400 });
    }

    // Blocage de créneaux horaires spécifiques
    if (heures && Array.isArray(heures) && heures.length > 0) {
      const created = [];
      for (const heure of heures) {
        const [h, m] = heure.split(':').map(Number);
        const dateDebut = new Date(date);
        dateDebut.setHours(h, m, 0, 0);
        const dateFin = new Date(date);
        dateFin.setHours(h, 59, 59, 999);
        const indispo = await prisma.indisponibilite.create({
          data: {
            dateDebut,
            dateFin,
            motif: motif || "Créneau bloqué",
            jourEntier: false,
          },
        });
        created.push(indispo);
      }
      return NextResponse.json({ success: true, count: created.length });
    }

    // Blocage journée entière
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const indispo = await prisma.indisponibilite.create({
      data: {
        dateDebut: startOfDay,
        dateFin: endOfDay,
        motif: motif || "Congé / Indisponible",
        jourEntier: true,
      },
    });

    return NextResponse.json({ success: true, indispo });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'indisponibilité:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// --- SUPPRIMER PAR ID (journée entière) OU PAR DATE (tous les créneaux) ---
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const body = await request.json();

    if (body.date) {
      // Supprimer tous les blocages (jourEntier ou créneaux) pour cette date
      const targetDate = new Date(body.date);
      const start = new Date(targetDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(targetDate);
      end.setHours(23, 59, 59, 999);
      await prisma.indisponibilite.deleteMany({
        where: { dateDebut: { gte: start, lte: end } },
      });
    } else if (body.id) {
      await prisma.indisponibilite.delete({ where: { id: body.id } });
    } else {
      return NextResponse.json({ error: "id ou date requis" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
