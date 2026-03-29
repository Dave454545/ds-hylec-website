import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const { userId } = await request.json();
    
    // On génère un mot de passe aléatoire de 8 caractères (ex: "k7x9b2m4")
    const newPassword = Math.random().toString(36).slice(-8); 
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // On met à jour le client dans la base de données
    await prisma.user.update({
      where: { id: userId },
      data: { motDePasse: hashedPassword }
    });

    // On renvoie le mot de passe en clair pour que Sabile puisse le lire sur son écran
    return NextResponse.json({ success: true, newPassword });
  } catch (error) {
    console.error("Erreur reset MDP:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}