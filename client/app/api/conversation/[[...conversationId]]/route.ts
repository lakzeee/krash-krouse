import { NextRequest, NextResponse } from 'next/server';
import { getLearningOptions } from '@/services/ai/google';
import { ConversationService } from '@/services/prisma/ConversationService';
import { NotFoundError } from '@/lib/errors/prisma';
import { withRouteErrorHandling } from '@/lib/helpers/api';
import { getUserIdFromAuth } from '@/lib/helpers/auth';
import {
  DEFAULT_MODEL_ID,
  getValidateAndSuggestGoalsPrompt,
} from '@/lib/prompts/newCourse';
import {
  OptionalRouteSegmenetSchema,
  RequiredRouteSegmenetSchema,
} from '@/lib/zod';
import { NewCourseRequestBody, NewCourseRequestBodySchema } from '@/types/api';

/**
 * @swagger
 * /api/conversation:
 *   get:
 *     summary: Get a conversation
 *     description: Get a conversation by its ID
 *     tags:
 *       - Conversation
 *     responses:
 *       200:
 *         description: Successfully retrieved all conversations for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Conversation'
 */
/**
 * @swagger
 * /api/conversation/{conversationId}:
 *   get:
 *     summary: Get a conversation
 *     description: Get a conversation by its ID
 *     tags:
 *       - Conversation
 *     parameters:
 *       - name: conversationId
 *         in: path
 *         required: true
 *         description: The ID of the conversation to get
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved conversation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 */
export const GET = withRouteErrorHandling(
  async (
    request: NextRequest | Request,
    { params }: { params: Promise<{ conversationId: string[] }> }
  ) => {
    const userId = await getUserIdFromAuth();
    const { conversationId } = await params;
    const conversationService = new ConversationService();

    // validate the conversationId, this can be undefined or a string array with a single string
    const parsedConversationId =
      OptionalRouteSegmenetSchema.parse(conversationId);

    if (!parsedConversationId) {
      const conversations =
        await conversationService.findConversationsByUserId(userId);

      return NextResponse.json({ data: conversations });
    }

    // look for the conversation in the database

    const conversation = await conversationService.findConversationById(
      userId,
      parsedConversationId[0]
    );

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    return NextResponse.json({ data: conversation });
  }
);

/**
 * @swagger
 * /api/conversation:
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
    const userId = await getUserIdFromAuth();

    const body: NewCourseRequestBody = await request.json();

    const parsedBody = NewCourseRequestBodySchema.parse(body);

    const prompt = getValidateAndSuggestGoalsPrompt(parsedBody.message);

    const learningOptions = await getLearningOptions(prompt);

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
          id: userId,
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

/**
 * @swagger
 * /api/conversation/{conversationId}:
 *   delete:
 *     summary: Delete a conversation
 *     description: Delete a conversation by its ID
 *     tags:
 *       - Conversation
 *     parameters:
 *       - name: conversationId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully deleted conversation
 *         content:
 *           application/json:
 *             schema:
 *               type:
 *               description: Conversation object
 *       404:
 *         description: Conversation not found
 */
export const DELETE = withRouteErrorHandling(
  async (
    request: NextRequest | Request,
    { params }: { params: Promise<{ conversationId: string[] }> }
  ) => {
    const userId = await getUserIdFromAuth();

    const { conversationId } = await params;
    const parsedConversationId =
      RequiredRouteSegmenetSchema.parse(conversationId);

    const conversationService = new ConversationService();
    const conversation = await conversationService.deleteConversation(
      userId,
      parsedConversationId[0]
    );

    return NextResponse.json({
      message: `Converation ID ${conversation.id} deleted`,
    });
  }
);

export const PUT = withRouteErrorHandling(
  async (
    request: NextRequest | Request,
    { params }: { params: Promise<{ conversationId: string[] }> }
  ) => {
    const userId = await getUserIdFromAuth();
    const { conversationId } = await params;

    const conversationService = new ConversationService();
  }
);
