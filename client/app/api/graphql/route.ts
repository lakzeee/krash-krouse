import { auth } from '@clerk/nextjs/server';
import { createYoga } from 'graphql-yoga';
import type { NextRequest } from 'next/server';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { CourseResolver, GraphQLContext } from '@/services/graphql';
import {
  CourseService,
  ChapterService,
  ConversationService,
  MessageService,
  UserService,
  LLModelService,
} from '@/services/prisma';
import { prisma } from '@/lib/prisma';

const schema = await buildSchema({
  resolvers: [CourseResolver],
  validate: false,
});

const yoga = createYoga<GraphQLContext>({
  schema,
  context: async ({ request }) => {
    const authResult = await auth();
    return {
      prisma,
      req: request,
      auth: authResult,
      services: {
        courseService: new CourseService(),
        chapterService: new ChapterService(),
        conversationService: new ConversationService(),
        messageService: new MessageService(),
        userService: new UserService(),
        llmodelService: new LLModelService(),
      },
    };
  },
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response, Request },
});

export async function GET(request: NextRequest) {
  return yoga(request);
}

export async function POST(request: NextRequest) {
  return yoga(request);
}
