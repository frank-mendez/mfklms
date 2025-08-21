import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await hash('admin123', 12)

  // Create SUPERADMIN user
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {},
    create: {
      email: 'superadmin@example.com',
      password: password,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPERADMIN',
      status: 'ACTIVE',
      verified: true,
    },
  })

  // Create ADMIN user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: password,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      status: 'ACTIVE',
      verified: true,
    },
  })

  // Create regular USER
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: password,
      firstName: 'Regular',
      lastName: 'User',
      role: 'USER',
      status: 'PENDING',
      verified: false,
    },
  })

  console.log({ superAdmin, admin, user })
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