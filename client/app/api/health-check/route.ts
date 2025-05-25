import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/health-check:
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
 *                   example: "Hello, world!"
 */
export async function GET() {
  return NextResponse.json({ message: 'Hello, world!' });
}
