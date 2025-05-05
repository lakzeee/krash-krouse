import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export interface GraphQLContext {
    prisma: PrismaClient;
    req: NextRequest;
    auth: Awaited<ReturnType<typeof auth>>;
}
