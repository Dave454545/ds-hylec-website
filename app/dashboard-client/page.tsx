import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import DashboardClientUI from "./DashboardClientUI"; // Ou le nom de ton fichier UI

export default async function DashboardClientPage() {
  const session = await getServerSession(authOptions);

  // Sécurité : redirection si non connecté
  if (!session) {
    redirect("/login");
  }

  // On récupère toutes les données du client
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      vehicules: true,
      parrainages: true,
      reservations: {
        include: {
          vehicule: true, // On inclut le véhicule pour l'afficher sur la facture
        },
        orderBy: {
          dateIntervention: 'desc' // Les plus récentes en premier !
        }
      }
    }
  });

  if (!dbUser) redirect("/login");

  // LE FIX NEXT.JS : On transforme les données pour éviter l'erreur Turbopack avec les dates
  const safeUser = JSON.parse(JSON.stringify(dbUser));
  const safeVehicules = JSON.parse(JSON.stringify(dbUser.vehicules));
  const safeParrainages = JSON.parse(JSON.stringify(dbUser.parrainages));

  // Note : on n'a plus besoin de la variable "factures" séparée, 
  // car l'UI se sert de safeUser.reservations directement !

  return (
    <DashboardClientUI 
      user={safeUser} 
      vehicules={safeVehicules} 
      parrainages={safeParrainages}
      factures={[]} // On laisse un tableau vide pour ne pas casser tes anciennes props si elles traînent
    />
  );
}