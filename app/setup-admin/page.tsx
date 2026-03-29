import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function SetupAdmin() {
  const adminEmail = "contact@kreativacademy.com"; // Remplacer par l'email de Sabile si besoin
  
  // Vérifie si l'admin existe déjà
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingAdmin) {
    return <div>Le compte Admin {adminEmail} existe déjà !</div>;
  }

  // Crée le compte admin
  const hashedPassword = await bcrypt.hash("Admin123!", 10);
  
  await prisma.user.create({
    data: {
      nom: "Admin",
      prenom: "DS HY'LEC",
      email: adminEmail,
      motDePasse: hashedPassword,
      role: "ADMIN"
    }
  });

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>✅ Compte Gérant créé avec succès !</h1>
      <p>Email : <b>{adminEmail}</b></p>
      <p>Mot de passe : <b>Admin123!</b></p>
      <a href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>Aller se connecter</a>
    </div>
  );
}