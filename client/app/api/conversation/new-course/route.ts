import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { ConversationService } from '@/services/prisma/ConversationService';
import { NewCourseRequestBody } from '@/types/api';

export async function GET() {
  await auth.protect();
  return Response.json({ message: 'Hello world!' });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth.protect();
  const body: NewCourseRequestBody = await request.json();
  const conversationService = new ConversationService();

  const res = await conversationService.createConversation(
    userId,
    body.message
  );

  return Response.json(res);
}
