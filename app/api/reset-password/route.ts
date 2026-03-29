import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    // 1. On cherche l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // 2. On hash le nouveau mot de passe (Cyber-sécurité)
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. On met à jour l'utilisateur dans la base
    await prisma.user.update({
      where: { email: email },
      data: { motDePasse: hashedPassword }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Mot de passe mis à jour avec succès" 
    });

  } catch (error: any) {
    console.error("Erreur Reset Password:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}