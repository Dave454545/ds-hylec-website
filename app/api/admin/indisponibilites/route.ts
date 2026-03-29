import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// --- AJOUTER UN JOUR DE CONGÉ ---
export async function POST(request: Request) {
  // Sécurité : On vérifie que c'est bien l'Admin qui fait ça
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const { date, motif } = await request.json();
    const targetDate = new Date(date);
    
    // On bloque de 00h00 à 23h59
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const indispo = await prisma.indisponibilite.create({
      data: {
        dateDebut: startOfDay,
        dateFin: endOfDay,
        motif: motif || "Congé / Indisponible",
        jourEntier: true
      }
    });

    return NextResponse.json({ success: true, indispo });
  } catch (error) {
    console.error("Erreur lors de l'ajout du congé:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// --- SUPPRIMER UN JOUR DE CONGÉ ---
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const { id } = await request.json();
    await prisma.indisponibilite.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression du congé:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}