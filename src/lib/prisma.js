// ─────────────────────────────────────────────────────────────────────────────
// File: src/lib/prisma.ts
// Desc: Singleton Prisma client (Node runtime only). Adjust import path if your
// Prisma client is generated elsewhere. With your schema, the generator
// outputs to `src/generated/prisma`.
// ─────────────────────────────────────────────────────────────────────────────
import { PrismaClient } from '@/generated/prisma'

const globalForPrisma = global

const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
