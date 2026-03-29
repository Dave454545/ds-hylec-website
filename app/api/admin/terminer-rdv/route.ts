import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    // Sécurité : On vérifie que c'est bien l'admin qui fait ça
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { reservationId } = await request.json();

    // 1. Récupérer la réservation avec l'email du client (le potentiel filleul)
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { user: true }
    });

    if (!reservation || !reservation.user) {
      return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });
    }

    // La fameuse transaction pour que tout se fasse en même temps (ou rien du tout en cas de bug)
    await prisma.$transaction(async (tx) => {
      
      // 2. Mettre à jour la réservation -> TERMINEE
      await tx.reservation.update({
        where: { id: reservationId },
        data: { statut: 'TERMINEE' }
      });

      // 3. Chercher s'il y a un parrainage EN_ATTENTE pour cet email
      const parrainage = await tx.parrainage.findFirst({
        where: {
          filleulEmail: reservation.user.email,
          statut: 'EN_ATTENTE'
        }
      });

      // 4. Si on a trouvé un parrainage, la magie opère 🪄
      if (parrainage) {
        // On passe le parrainage en VALIDE
        await tx.parrainage.update({
          where: { id: parrainage.id },
          data: { statut: 'VALIDE' }
        });

        // On donne enfin l'argent (10€) dans la cagnotte du parrain !
        await tx.user.update({
          where: { id: parrainage.parrainId },
          data: {
            cagnotte: { increment: parrainage.creditParrain }
          }
        });
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erreur lors de la validation:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}