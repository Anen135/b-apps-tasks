// sourcery skip: use-braces
import { PrismaClient } from '@/generated/prisma'

const globalForPrisma = global

const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
