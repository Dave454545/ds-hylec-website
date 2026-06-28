import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import crypto from 'crypto';
import { ResetPasswordEmail } from '@/components/emails/ResetPasswordEmail';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY!);

// Réponse générique : ne révèle pas si l'email existe ou non
const ok = () => NextResponse.json({ success: true });

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== 'string') return ok();

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return ok();

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    await prisma.user.update({
      where: { email: user.email },
      data: { resetToken: token, resetTokenExpires: expires },
    });

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    const { error: resendError } = await resend.emails.send({
      from: 'DS HY\'LEC <contact@dshylec.fr>',
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe DS HY\'LEC',
      react: React.createElement(ResetPasswordEmail, { prenom: user.prenom, resetLink }),
    });

    if (resendError) {
      console.error('Erreur envoi email reset:', resendError);
    }

    return ok();
  } catch (error) {
    console.error('Forgot password error:', error);
    return ok();
  }
}
