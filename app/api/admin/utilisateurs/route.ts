import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(request: Request) {
  // Sécurité : On vérifie que c'est bien l'Admin
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const { userId } = await request.json();
    
    // Prisma va automatiquement supprimer le client ET ses véhicules/réservations
    // grâce au "onDelete: Cascade" qu'on avait mis dans le schema !
    await prisma.user.delete({ 
      where: { id: userId } 
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression client:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}