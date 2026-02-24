import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@store.com' },
    update: {
      role: 'ADMIN',
      passwordHash: passwordHash
    },
    create: {
      email: 'admin@store.com',
      name: 'Admin User',
      passwordHash: passwordHash,
      role: 'ADMIN',
    },
  })

  console.log('Admin user created:', adminUser.email)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
