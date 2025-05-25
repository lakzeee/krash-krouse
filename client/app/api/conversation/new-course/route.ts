import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getLearningOptions } from '@/services/ai/google';
import { ConversationService } from '@/services/prisma/ConversationService';
import { withRouteErrorHandling } from '@/lib/helpers/api';
import {
  DEFAULT_MODEL_ID,
  getValidateAndSuggestGoalsPrompt,
} from '@/lib/prompts/newCourse';
import { NewCourseRequestBody, NewCourseRequestBodySchema } from '@/types/api';

/**
 * @swagger
 * /api/conversation/new-course:
 *   post:
 *     summary: Create new course learning options
 *     description: Analyzes user input and generates learning options for a new course
 *     tags:
 *       - Course Creation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: User's learning goal or course description
 *                 example: "I want to learn React and Next.js for web development"
 *     responses:
 *       200:
 *         description: Successfully generated learning options
 *         content:
 *           application/json:
 *             schema:
 *               type: Conversation
 *               description: Conversation object
 */
export const POST = withRouteErrorHandling(
  async (request: NextRequest | Request) => {
    const body: NewCourseRequestBody = await request.json();

    const parsedBody = NewCourseRequestBodySchema.parse(body);

    const prompt = getValidateAndSuggestGoalsPrompt(parsedBody.message);

    const learningOptions = await getLearningOptions(prompt);

    // parse learning options as json
    const parsedLearningOptions = JSON.parse(learningOptions!);

    const conversationService = new ConversationService();

    // create converation with userMessage and learningOptions
    const userMessage = {
      parts: JSON.stringify([{ text: parsedBody.message }]),
      isUser: true,
    };
    const learningOptionsMessage = {
      parts: JSON.stringify([{ text: parsedLearningOptions }]),
      isUser: false,
    };

    const res = await conversationService.createConversation({
      user: {
        connect: {
          id: 'user_2we4OvPDMsLXFkYjL1zv1lQOFgu',
        },
      },
      aiModel: {
        connect: {
          id: DEFAULT_MODEL_ID,
        },
      },
      messages: {
        create: [userMessage, learningOptionsMessage],
      },
    });

    return NextResponse.json(res);
  }
);
