import 'reflect-metadata';
import { createYoga } from 'graphql-yoga';
import { buildSchema, Query, Resolver } from 'type-graphql';
import { prisma } from '@/services/prisma';
import { GraphQLContext } from '@/server/context';
import type { NextRequest } from 'next/server';
import { resolvers } from "@generated/type-graphql";

const schema = await buildSchema({
  // @ts-ignore
  resolvers: [...resolvers],
  validate: false,
});

const yoga = createYoga<{
  req: NextRequest
} & GraphQLContext>({
  schema,
  context: ({ request }) => ({ prisma, req: request }), // Pass request to context if needed
  graphqlEndpoint: '/api/graphql', // Recommended to keep for Yoga
  fetchAPI: { Response, Request: Request }, // Ensure Yoga uses standard Fetch APIs
});

export async function GET(request: NextRequest) {
  return yoga(request);
}

export async function POST(request: NextRequest) {
  return yoga(request);
}
