import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getLearningOptions } from '@/services/ai/google';
import { withRouteErrorHandling } from '@/lib/helpers/api';
import { getValidateAndSuggestGoalsPrompt } from '@/lib/prompts/newCourse';
import { NewCourseRequestBody, NewCourseRequestBodySchema } from '@/types/api';

/**
 * @swagger
 * /api/conversation/new-course:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns a simple hello world message to verify the API is working
 *     tags:
 *       - Health Check
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hello world!"
 */
export async function GET(request: NextRequest | Request) {
  return NextResponse.json({ message: 'Hello world!' });
}

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
 *               type: object
 *               description: AI-generated learning options and suggestions
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid request body"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to generate learning options"
 */
export const POST = withRouteErrorHandling(
  async (request: NextRequest | Request) => {
    const body: NewCourseRequestBody = await request.json();

    const parsedBody = NewCourseRequestBodySchema.parse(body);

    const prompt = getValidateAndSuggestGoalsPrompt(body.message);

    const learningOptions = await getLearningOptions(prompt);

    // const conversationService = new ConversationService();

    // const res = await conversationService.createConversation(
    //   'user_2we4OvPDMsLXFkYjL1zv1lQOFgu',
    //   body.message,
    //   DEFAULT_MODEL_ID
    // );

    return NextResponse.json(learningOptions);
  }
);
