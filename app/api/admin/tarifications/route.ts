import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// --- RÉCUPÉRER TOUS LES PRIX ---
export async function GET() {
  try {
    const tarifs = await prisma.tarification.findMany();
    return NextResponse.json(tarifs);
  } catch (error) {
    console.error("Erreur récupération tarifs:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// --- MODIFIER OU AJOUTER UN PRIX ---
export async function POST(request: Request) {
  // Sécurité : Uniquement pour Sabile (l'Admin)
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const { service, prix } = await request.json();
    const prixFloat = parseFloat(prix);

    if (isNaN(prixFloat) || prixFloat < 0) {
      return NextResponse.json({ error: "Prix invalide" }, { status: 400 });
    }

    // Le "upsert" est magique : s'il n'y a pas encore de prix pour ce service, 
    // il le crée. S'il y en a déjà un, il le met à jour !
    const tarif = await prisma.tarification.upsert({
      where: { service: service },
      update: { prix: prixFloat },
      create: { service: service, prix: prixFloat }
    });

    return NextResponse.json({ success: true, tarif });
  } catch (error) {
    console.error("Erreur mise à jour tarif:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}