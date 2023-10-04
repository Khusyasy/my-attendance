import { PrismaClient, UserRole } from '@prisma/client'
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

  console.log('Creating dummy courses...')
  const courses = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      const name = faker.lorem.words(3)
      const time = faker.date.future()
      return await prisma.course.create({
        data: {
          code: name.split(' ').map((w) => w[0]).join(''),
          name,
          startTime: time,
          endTime: new Date(time.setHours(time.getHours() + 3)),
          teacherId: teacher.id,
        },
      })
    })
  )

  console.log('Creating dummy enrollments...')
  await Promise.all(
    students.map(async (student) => {
      for (let i = 0; i < 4; i++) {
        const course = faker.helpers.arrayElement(courses)
        await prisma.enrollment.create({
          data: {
            userId: student.id,
            courseId: course.id,
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
