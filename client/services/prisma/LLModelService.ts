import { LLModel, PrismaClient, LLMProvider } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export class LLModelService {
  async createLLModel(data: {
    provider: LLMProvider;
    modelName: string;
    displayName?: string;
    contextWindow?: number;
  }): Promise<LLModel> {
    return prisma.lLModel.create({
      data,
    });
  }

  async getLLModelById(id: string): Promise<LLModel | null> {
    return prisma.lLModel.findUnique({
      where: { id },
    });
  }

  async getLLModelByModelName(modelName: string): Promise<LLModel | null> {
    return prisma.lLModel.findUnique({
      where: { modelName },
    });
  }

  async getAllLLModels(): Promise<LLModel[]> {
    return prisma.lLModel.findMany();
  }

  async updateLLModel(
    id: string,
    data: {
      provider?: LLMProvider;
      modelName?: string;
      displayName?: string;
      contextWindow?: number;
    }
  ): Promise<LLModel | null> {
    // Check if the model exists before attempting to update
    const existingModel = await prisma.lLModel.findUnique({ where: { id } });
    if (!existingModel) {
      return null; // Or throw a NotFoundError
    }
    return prisma.lLModel.update({
      where: { id },
      data,
    });
  }

  async deleteLLModel(id: string): Promise<LLModel | null> {
    // Check if the model exists before attempting to delete
    const existingModel = await prisma.lLModel.findUnique({ where: { id } });
    if (!existingModel) {
      return null; // Or throw a NotFoundError
    }
    return prisma.lLModel.delete({
      where: { id },
    });
  }
}
