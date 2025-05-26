import { PrismaClient, LLModel, LLMProvider } from '@prisma/client';

const prisma = new PrismaClient();

export const createLLModel = async (data: {
  provider: LLMProvider;
  modelName: string;
  displayName?: string;
  contextWindow?: number;
}): Promise<LLModel> => {
  return prisma.lLModel.create({
    data,
  });
};

export const getLLModelById = async (id: string): Promise<LLModel | null> => {
  return prisma.lLModel.findUnique({
    where: { id },
  });
};

export const getLLModelByModelName = async (
  modelName: string
): Promise<LLModel | null> => {
  return prisma.lLModel.findUnique({
    where: { modelName },
  });
};

export const getAllLLModels = async (): Promise<LLModel[]> => {
  return prisma.lLModel.findMany();
};

export const updateLLModel = async (
  id: string,
  data: {
    provider?: LLMProvider;
    modelName?: string;
    displayName?: string;
    contextWindow?: number;
  }
): Promise<LLModel | null> => {
  return prisma.lLModel.update({
    where: { id },
    data,
  });
};

export const deleteLLModel = async (id: string): Promise<LLModel | null> => {
  return prisma.lLModel.delete({
    where: { id },
  });
};
