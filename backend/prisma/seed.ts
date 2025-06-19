import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      name: 'John Doe',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
    },
  })

  console.log('✅ Users created:', { user1: user1.name, user2: user2.name })

  // Create sample tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the React Node assessment project',
        status: 'PENDING',
        priority: 'HIGH',
        dueDate: new Date('2024-12-31'),
        userId: user1.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        dueDate: new Date('2024-12-15'),
        userId: user1.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Code review for feature branch',
        description: 'Review pull request for new user authentication feature',
        status: 'PENDING',
        priority: 'URGENT',
        userId: user2.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Update dependencies',
        description: 'Update all npm packages to their latest versions',
        status: 'COMPLETED',
        priority: 'LOW',
        userId: user2.id,
      },
    }),
  ])

  console.log('✅ Tasks created:', tasks.length, 'tasks')
  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 