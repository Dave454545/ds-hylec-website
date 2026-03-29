import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminUI from "./AdminUI";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  // 1. Récupération des données brutes
  const reservations = await prisma.reservation.findMany({
    include: { vehicule: true, user: true },
    orderBy: { dateIntervention: 'asc' }
  });

  const users = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    include: { vehicules: true },
    orderBy: { dateCreation: 'desc' }
  });

  const indisponibilites = await prisma.indisponibilite.findMany({
    where: { dateFin: { gte: new Date() } },
    orderBy: { dateDebut: 'asc' }
  });

  const tarifications = await prisma.tarification.findMany();

  // 2. Calcul des stats
  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.statut === 'EN_ATTENTE').length,
    ca: reservations.reduce((acc, r) => acc + r.montantTotal, 0),
    totalClients: users.length
  };

  // 3. LE FIX NEXT.JS : On transforme les données pour éviter l'erreur Turbopack
  const safeReservations = JSON.parse(JSON.stringify(reservations));
  const safeUsers = JSON.parse(JSON.stringify(users));
  const safeIndisponibilites = JSON.parse(JSON.stringify(indisponibilites));
  const safeTarifications = JSON.parse(JSON.stringify(tarifications));

  return <AdminUI 
    initialReservations={safeReservations} 
    initialUsers={safeUsers} 
    initialIndisponibilites={safeIndisponibilites} 
    initialTarifications={safeTarifications} 
    stats={stats} 
  />;
}