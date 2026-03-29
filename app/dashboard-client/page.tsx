import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import DashboardClientUI from "./DashboardClientUI";

export default async function DashboardClientPage() {
  const session = await getServerSession(authOptions);

  // Sécurité : redirection si non connecté ou si l'ID n'est pas trouvé
  if (!session || !(session.user as any)?.id) {
    redirect("/login");
  }

  // On récupère toutes les données du client
  // LE FIX EST ICI : on utilise (session.user as any).id
  const dbUser = await prisma.user.findUnique({
    where: { id: (session.user as any).id }, 
    include: {
      vehicules: true,
      parrainages: true,
      reservations: {
        include: {
          vehicule: true, 
        },
        orderBy: {
          dateIntervention: 'desc' 
        }
      }
    }
  });

  if (!dbUser) {
    redirect("/login");
  }

  // LE FIX NEXT.JS : On transforme les données pour éviter l'erreur Turbopack avec les dates
  const safeUser = JSON.parse(JSON.stringify(dbUser));
  const safeVehicules = JSON.parse(JSON.stringify(dbUser.vehicules));
  const safeParrainages = JSON.parse(JSON.stringify(dbUser.parrainages));

  return (
    <DashboardClientUI 
      user={safeUser} 
      vehicules={safeVehicules} 
      parrainages={safeParrainages}
      factures={[]} 
    />
  );
}