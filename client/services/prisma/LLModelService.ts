import { LLModel } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export class LLModelService {
  /**
   * Finds an LLModel by its ID.
   * @param modelId - The ID of the LLModel to find.
   * @returns A promise resolving to the LLModel object or null if not found.
   */
  async findLLModelById(modelId: string): Promise<LLModel | null> {
    console.log(`Fetching LLModel ${modelId} via LLModelService`);
    return prisma.lLModel.findUnique({
      where: { id: modelId },
    });
  }

  // Add other methods if needed (e.g., findLLModelByName, listLLModels)
}
