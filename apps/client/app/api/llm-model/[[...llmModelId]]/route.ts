import { LLMProvider } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { LLModelService } from '@/services/prisma';
// Assuming these can be reused or adapted
import { NotFoundError } from '@/lib/errors/prisma';
import { withRouteErrorHandling } from '@/lib/helpers/api';
import {
  OptionalRouteSegmenetSchema,
  RequiredRouteSegmenetSchema,
} from '@/lib/zod';

/**
 * @swagger
 * /api/llm-model:
 *   get:
 *     summary: Get all LLM Models
 *     description: Retrieves a list of all available LLM Models.
 *     tags:
 *       - LLM Model
 *     responses:
 *       200:
 *         description: A list of LLM Models.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LLModel'
 *       404:
 *         description: LLM Model not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: Error
 *               description: Error object
 */

/**
 * @swagger
 * /api/llm-model/{llmModelId}:
 *   get:
 *     summary: Get an LLM Model by ID
 *     description: Retrieves a specific LLM Model by its unique ID.
 *     tags:
 *       - LLM Model
 *     parameters:
 *       - name: llmModelId
 *         in: path
 *         required: true
 *         description: The ID of the LLM Model to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested LLM Model.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LLModel'
 *       404:
 *         description: LLM Model not found.
 */
export const GET = withRouteErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: { llmModelId?: string[] } }
  ) => {
    const llmModelService = new LLModelService();
    const parsedLlmModelId = OptionalRouteSegmenetSchema.parse(
      params.llmModelId
    );

    if (parsedLlmModelId && parsedLlmModelId.length > 0) {
      const llmModel = await llmModelService.getLLModelById(
        parsedLlmModelId[0]
      );
      if (!llmModel) {
        throw new NotFoundError('LLM Model not found');
      }
      return NextResponse.json(llmModel);
    } else {
      const llmModels = await llmModelService.getAllLLModels();
      return NextResponse.json(llmModels);
    }
  }
);

/**
 * @swagger
 * /api/llm-model:
 *   post:
 *     summary: Create a new LLM Model
 *     description: Adds a new LLM Model to the system.
 *     tags:
 *       - LLM Model
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - provider
 *               - modelName
 *             properties:
 *               provider:
 *                 type: string
 *                 description: The provider of the LLM Model.
 *               modelName:
 *                 type: string
 *                 description: The unique name of the model.
 *               displayName:
 *                 type: string
 *                 description: An optional display name for the model.
 *               contextWindow:
 *                 type: integer
 *                 description: An optional context window size for the model.
 *     responses:
 *       201:
 *         description: LLM Model created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LLModel'
 *       400:
 *         description: Invalid input for LLM Model.
 */
export const POST = withRouteErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  // TODO: Replace with Zod schema validation for the request body
  const { provider, modelName, displayName, contextWindow } = body;

  if (!provider || !modelName) {
    return NextResponse.json(
      { error: 'Provider and modelName are required' },
      { status: 400 }
    );
  }

  if (!Object.values(LLMProvider).includes(provider as LLMProvider)) {
    return NextResponse.json(
      { error: 'Invalid LLMProvider value' },
      { status: 400 }
    );
  }

  const llmModelService = new LLModelService();
  const newLLModel = await llmModelService.createLLModel({
    provider: provider as LLMProvider,
    modelName,
    displayName,
    contextWindow,
  });
  return NextResponse.json(newLLModel, { status: 201 });
});

/**
 * @swagger
 * /api/llm-model/{llmModelId}:
 *   put:
 *     summary: Update an LLM Model
 *     description: Updates an existing LLM Model by its ID.
 *     tags:
 *       - LLM Model
 *     parameters:
 *       - name: llmModelId
 *         in: path
 *         required: true
 *         description: The ID of the LLM Model to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               provider:
 *                 type: string
 *                 description: The provider of the LLM Model.
 *               modelName:
 *                 type: string
 *                 description: The unique name of the model.
 *               displayName:
 *                 type: string
 *                 description: An optional display name for the model.
 *               contextWindow:
 *                 type: integer
 *                 description: An optional context window size for the model.
 *     responses:
 *       200:
 *         description: LLM Model updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LLModel'
 *       400:
 *         description: Invalid input for LLM Model or ID missing.
 *       404:
 *         description: LLM Model not found.
 */
export const PUT = withRouteErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: { llmModelId?: string[] } }
  ) => {
    const parsedLlmModelId = RequiredRouteSegmenetSchema.parse(
      params.llmModelId
    );
    const id = parsedLlmModelId[0];

    const body = await request.json();
    // TODO: Replace with Zod schema validation for the request body
    const { provider, modelName, displayName, contextWindow } = body;

    if (
      provider &&
      !Object.values(LLMProvider).includes(provider as LLMProvider)
    ) {
      return NextResponse.json(
        { error: 'Invalid LLMProvider value' },
        { status: 400 }
      );
    }

    const llmModelService = new LLModelService();
    const updatedLLModel = await llmModelService.updateLLModel(id, {
      provider: provider as LLMProvider,
      modelName,
      displayName,
      contextWindow,
    });

    if (!updatedLLModel) {
      throw new NotFoundError('LLM Model not found for update');
    }
    return NextResponse.json(updatedLLModel);
  }
);

/**
 * @swagger
 * /api/llm-model/{llmModelId}:
 *   delete:
 *     summary: Delete an LLM Model
 *     description: Deletes an LLM Model by its ID.
 *     tags:
 *       - LLM Model
 *     parameters:
 *       - name: llmModelId
 *         in: path
 *         required: true
 *         description: The ID of the LLM Model to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: LLM Model deleted successfully.
 *       404:
 *         description: LLM Model not found.
 */
export const DELETE = withRouteErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: { llmModelId?: string[] } }
  ) => {
    const parsedLlmModelId = RequiredRouteSegmenetSchema.parse(
      params.llmModelId
    );
    const id = parsedLlmModelId[0];

    const llmModelService = new LLModelService();
    const deletedLLModel = await llmModelService.deleteLLModel(id);

    if (!deletedLLModel) {
      throw new NotFoundError('LLM Model not found for deletion');
    }
    return NextResponse.json({ message: 'LLM Model deleted successfully' });
  }
);
