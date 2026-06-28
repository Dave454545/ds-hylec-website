import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token et mot de passe requis" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins 6 caractères" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { resetToken: token } });

    if (!user || !user.resetTokenExpires) {
      return NextResponse.json({ error: "Lien invalide ou déjà utilisé" }, { status: 400 });
    }

    if (user.resetTokenExpires < new Date()) {
      return NextResponse.json({ error: "Ce lien a expiré. Veuillez en demander un nouveau." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        motDePasse: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return NextResponse.json({ success: true, message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur Reset Password:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
