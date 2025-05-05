import 'reflect-metadata';
import { createYoga } from 'graphql-yoga';
import { buildSchema } from 'type-graphql';
import { prisma } from '@/services/prisma';
import { GraphQLContext } from '@/graphql/context';
import type { NextRequest } from 'next/server';
import { resolvers } from "@generated/type-graphql";
import { auth } from '@clerk/nextjs/server';

const schema = await buildSchema({
  resolvers: [...resolvers],
  validate: false,
});

const yoga = createYoga<{
  req: NextRequest
  auth: ReturnType<typeof auth>;
} & GraphQLContext>({
  schema,
  context: async ({ request }) => {
    const authResult = auth();
    console.log(await authResult);
    return { prisma, req: request, auth: authResult };
  },
  graphqlEndpoint: '/api/graphql', 
  fetchAPI: { Response, Request: Request }, 
});

export async function GET(request: NextRequest) {
  return yoga(request);
}

export async function POST(request: NextRequest) {
  return yoga(request);
}
