import 'reflect-metadata';
import { createYoga } from 'graphql-yoga';
import { buildSchema } from 'type-graphql';
import { prisma } from '@/services/prisma';
import type { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { CourseResolver,GraphQLContext } from '@/graphql';

const schema = await buildSchema({
  resolvers: [CourseResolver],
  validate: false,
});

const yoga = createYoga<GraphQLContext>({
  schema,
  context: async ({ request }) => {
    const authResult = await auth();
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
