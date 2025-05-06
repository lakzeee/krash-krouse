import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import {
  ChapterService,
  CourseService,
  ConversationService,
  MessageService,
  UserService,
  LLModelService,
} from '@/prisma/services';

export interface GraphQLContext {
  prisma: PrismaClient;
  req: NextRequest;
  auth: Awaited<ReturnType<typeof auth>>;
  services: {
    chapterService: ChapterService;
    courseService: CourseService;
    conversationService: ConversationService;
    userService: UserService;
    llmodelService: LLModelService;
    messageService: MessageService;
  };
}
