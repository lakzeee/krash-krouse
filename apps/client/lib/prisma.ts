import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { withOptimize } from '@prisma/extension-optimize';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const optimizeApiKey = process.env.OPTIMIZE_API_KEY;
if (!optimizeApiKey) {
  throw new Error('OPTIMIZE_API_KEY environment variable is not set.');
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })
    .$extends(
      withOptimize({
        apiKey: optimizeApiKey,
      })
    )
    .$extends(withAccelerate());

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
