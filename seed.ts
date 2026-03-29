// seed.ts (RACINE)
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as bcrypt from 'bcryptjs'

// Driver adapter OBLIGATOIRE Prisma 7
const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg(new Pool({ connectionString }))
export const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🚀 Seeding DS Hydrocarbure...')

  const adminPassword = await bcrypt.hash('admin123', 12)
  const clientPassword = await bcrypt.hash('client123', 12)

  // Admin Sabile
  const admin = await prisma.user.upsert({
    where: { email: 'sabile@dshydrocarbure.fr' },
    update: {},
    create: {
      nom: 'Sabile', prenom: 'Admin', email: 'sabile@dshydrocarbure.fr',
      motDePasse: adminPassword, telephone: '06 12 34 56 78', role: 'ADMIN'
    }
  })
  console.log('✅ Admin:', admin.email)

  // Client Thomas
  const client = await prisma.user.upsert({
    where: { email: 'thomas.dubois@email.com' },
    update: {},
    create: {
      nom: 'Dubois', prenom: 'Thomas', email: 'thomas.dubois@email.com',
      motDePasse: clientPassword, telephone: '06 98 76 54 32', role: 'CLIENT'
    }
  })
  console.log('✅ Client:', client.email)

  // Véhicules
  await prisma.vehicule.createMany({
    data: [
      { userId: client.id, marque: 'Peugeot', modele: '308', annee: 2018, carburant: 'DIESEL', immatriculation: 'AB-123-CD' },
      { userId: client.id, marque: 'Renault', modele: 'Clio 4', annee: 2020, carburant: 'ESSENCE', immatriculation: 'XY-456-ZW' }
    ]
  })
  console.log('✅ 2 véhicules')

  console.log('\n🎉 SEED TERMINÉ!')
  console.log('👨‍💼 sabile@dshydrocarbure.fr / admin123')
  console.log('👤 thomas.dubois@email.com / client123')
}

main()
  .catch(e => { console.error('❌', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
