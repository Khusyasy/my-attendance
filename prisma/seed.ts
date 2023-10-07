import { Day, PrismaClient, UserRole } from '@prisma/client'
const prisma = new PrismaClient()

import bcrypt from 'bcrypt'
const SALT_ROUNDS = 10

import { Sex, faker } from '@faker-js/faker'

function genName() {
  const sex = faker.person.sex() as Sex
  const firstName = faker.person.firstName(sex)
  const lastName = faker.person.lastName(sex)
  const name = faker.person.fullName({
    firstName,
    lastName,
    sex,
  });
  const username = faker.internet.userName({
    firstName,
    lastName,
  }).toLowerCase()
  return { name, username }
}

async function main() {
  console.log('Clearing database...')
  await prisma.enrollment.deleteMany()
  await prisma.classSchedule.deleteMany()
  await prisma.class.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany()

  console.log('Creating dummy main user...')
  const password = await bcrypt.hash('12345678', SALT_ROUNDS)

  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      username: 'admin',
      password,
      role: UserRole.ADMIN,
    },
  })

  const teacher = await prisma.user.create({
    data: {
      name: 'Teacher',
      username: 'teacher',
      password,
      role: UserRole.TEACHER,
    },
  })

  const student = await prisma.user.create({
    data: {
      name: 'Student',
      username: 'student',
      password,
      role: UserRole.STUDENT,
    },
  })

  console.log('Creating dummy admins...')
  const admins = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      const { name, username } = genName()
      return await prisma.user.create({
        data: {
          name,
          username,
          password,
          role: UserRole.ADMIN,
        },
      })
    })
  )

  console.log('Creating dummy teachers...')
  const teachers = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      const { name, username } = genName()
      return await prisma.user.create({
        data: {
          name,
          username,
          password,
          role: UserRole.TEACHER,
        },
      })
    })
  )

  console.log('Creating dummy students...')
  const students = await Promise.all(
    Array.from({ length: 100 }).map(async () => {
      const { name, username } = genName()
      return await prisma.user.create({
        data: {
          name,
          username,
          password,
          role: UserRole.STUDENT,
        },
      })
    })
  )

//   model Couse {
//   id    Int     @id @default(autoincrement())
//   code  String  @unique
//   name  String
//   Class Class[]
// }
  console.log('Creating dummy courses...')
  const courses = await Promise.all(
    Array.from({ length: 3 }).map(async () => {
      const name = faker.lorem.words(3)
      return await prisma.course.create({
        data: {
          code: name.split(' ').map((w) => w[0]).join(''),
          name,
        },
      })
    })
  )

  console.log('Creating dummy classes...')
  const classes = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      const course = faker.helpers.arrayElement(courses);
      return await prisma.class.create({
        data: {
          courseId: course.id,
          teacherId: teacher.id,
          name: `${course.code} ${faker.string.numeric(2)}`,
        },
      })
    })
  )

  // dummy schedule, each class have 16 week of schedule, each on the same day of week and hours
  console.log('Creating dummy schedules...')
  classes.forEach(async (c) => {
    for (let i = 0; i < 16; i++) {
      const day = faker.helpers.arrayElement(Object.values(Day))
      const startTime = new Date()
      const endTime = new Date(startTime.setHours(startTime.getHours() + 2))
      await prisma.classSchedule.create({
        data: {
          classId: c.id,
          day,
          startTime,
          endTime,
        },
      })
    }
  })

  console.log('Creating dummy enrollments...')
  await Promise.all(
    students.map(async (student) => {
      for (let i = 0; i < 4; i++) {
        const c = faker.helpers.arrayElement(classes)
        await prisma.enrollment.create({
          data: {
            userId: student.id,
            classId: c.id,
          },
        })
      }
    })
  )
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
