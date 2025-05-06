import { PrismaClient } from "@prisma/client";
import { LLModel } from "@prisma/client";

export class LLModelService {
  /**
   * Finds an LLModel by its ID.
   * @param prisma - The PrismaClient instance.
   * @param modelId - The ID of the LLModel to find.
   * @returns A promise resolving to the LLModel object or null if not found.
   */
  async findLLModelById(
    prisma: PrismaClient,
    modelId: string
  ): Promise<LLModel | null> {
    console.log(`Fetching LLModel ${modelId} via LLModelService`);
    return prisma.lLModel.findUnique({
      // Corrected model name usage
      where: { id: modelId },
    });
  }

  // Add other methods if needed (e.g., findLLModelByName, listLLModels)
}
