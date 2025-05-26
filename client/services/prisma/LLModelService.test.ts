import { LLMProvider, Prisma } from '@prisma/client';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import { LLModelService } from './LLModelService';

// Prisma is needed for types if you use specific input/output types directly.

// Mock Prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    lLModel: {
      // Ensure this matches the actual Prisma model name (e.g., llModel or lLModel)
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('LLModelService', () => {
  let llModelService: LLModelService;

  beforeEach(() => {
    llModelService = new LLModelService();
    vi.clearAllMocks(); // Clear mocks before each test
  });

  describe('createLLModel', () => {
    it('should create a new LLModel', async () => {
      const modelData = {
        provider: LLMProvider.GOOGLE,
        modelName: 'gemini-pro',
        displayName: 'Gemini Pro',
        contextWindow: 8192,
      };
      const mockLLModel = { id: 'model123', ...modelData };
      (prisma.lLModel.create as any).mockResolvedValue(mockLLModel);

      const llModel = await llModelService.createLLModel(modelData);

      expect(prisma.lLModel.create).toHaveBeenCalledWith({ data: modelData });
      expect(llModel).toEqual(mockLLModel);
    });
  });

  describe('getLLModelById', () => {
    it('should return an LLModel if found by ID', async () => {
      const modelId = 'model123';
      const mockLLModel = {
        id: modelId,
        modelName: 'gemini-pro',
        provider: LLMProvider.GOOGLE,
      };
      (prisma.lLModel.findUnique as any).mockResolvedValue(mockLLModel);

      const llModel = await llModelService.getLLModelById(modelId);

      expect(prisma.lLModel.findUnique).toHaveBeenCalledWith({
        where: { id: modelId },
      });
      expect(llModel).toEqual(mockLLModel);
    });

    it('should return null if LLModel not found by ID', async () => {
      const modelId = 'nonexistent';
      (prisma.lLModel.findUnique as any).mockResolvedValue(null);

      const llModel = await llModelService.getLLModelById(modelId);

      expect(prisma.lLModel.findUnique).toHaveBeenCalledWith({
        where: { id: modelId },
      });
      expect(llModel).toBeNull();
    });
  });

  describe('getLLModelByModelName', () => {
    it('should return an LLModel if found by model name', async () => {
      const modelName = 'gemini-pro';
      const mockLLModel = {
        id: 'model123',
        modelName,
        provider: LLMProvider.GOOGLE,
      };
      (prisma.lLModel.findUnique as any).mockResolvedValue(mockLLModel);

      const llModel = await llModelService.getLLModelByModelName(modelName);

      expect(prisma.lLModel.findUnique).toHaveBeenCalledWith({
        where: { modelName },
      });
      expect(llModel).toEqual(mockLLModel);
    });

    it('should return null if LLModel not found by model name', async () => {
      const modelName = 'nonexistent-model';
      (prisma.lLModel.findUnique as any).mockResolvedValue(null);

      const llModel = await llModelService.getLLModelByModelName(modelName);

      expect(prisma.lLModel.findUnique).toHaveBeenCalledWith({
        where: { modelName },
      });
      expect(llModel).toBeNull();
    });
  });

  describe('getAllLLModels', () => {
    it('should return all LLModels', async () => {
      const mockLLModels = [
        { id: 'model1', modelName: 'gemini-pro', provider: LLMProvider.GOOGLE },
        {
          id: 'model2',
          modelName: 'deepseek-coder',
          provider: LLMProvider.DEEPSEEK,
        },
      ];
      (prisma.lLModel.findMany as any).mockResolvedValue(mockLLModels);

      const llModels = await llModelService.getAllLLModels();

      expect(prisma.lLModel.findMany).toHaveBeenCalledWith();
      expect(llModels).toEqual(mockLLModels);
    });
  });

  describe('updateLLModel', () => {
    const modelId = 'model123';
    const updateData = { displayName: 'Gemini Pro v1.5' };

    it('should update an LLModel if found', async () => {
      const existingModel = {
        id: modelId,
        modelName: 'gemini-pro',
        provider: LLMProvider.GOOGLE,
      };
      const updatedModel = { ...existingModel, ...updateData };
      (prisma.lLModel.findUnique as any).mockResolvedValue(existingModel); // For the existence check
      (prisma.lLModel.update as any).mockResolvedValue(updatedModel);

      const llModel = await llModelService.updateLLModel(modelId, updateData);

      expect(prisma.lLModel.findUnique).toHaveBeenCalledWith({
        where: { id: modelId },
      });
      expect(prisma.lLModel.update).toHaveBeenCalledWith({
        where: { id: modelId },
        data: updateData,
      });
      expect(llModel).toEqual(updatedModel);
    });

    it('should return null if LLModel to update is not found', async () => {
      (prisma.lLModel.findUnique as any).mockResolvedValue(null); // For the existence check

      const llModel = await llModelService.updateLLModel(modelId, updateData);

      expect(prisma.lLModel.findUnique).toHaveBeenCalledWith({
        where: { id: modelId },
      });
      expect(prisma.lLModel.update).not.toHaveBeenCalled();
      expect(llModel).toBeNull();
    });
  });

  describe('deleteLLModel', () => {
    const modelId = 'model123';

    it('should delete an LLModel if found', async () => {
      const existingModel = {
        id: modelId,
        modelName: 'gemini-pro',
        provider: LLMProvider.GOOGLE,
      };
      (prisma.lLModel.findUnique as any).mockResolvedValue(existingModel); // For the existence check
      (prisma.lLModel.delete as any).mockResolvedValue(existingModel);

      const llModel = await llModelService.deleteLLModel(modelId);

      expect(prisma.lLModel.findUnique).toHaveBeenCalledWith({
        where: { id: modelId },
      });
      expect(prisma.lLModel.delete).toHaveBeenCalledWith({
        where: { id: modelId },
      });
      expect(llModel).toEqual(existingModel);
    });

    it('should return null if LLModel to delete is not found', async () => {
      (prisma.lLModel.findUnique as any).mockResolvedValue(null); // For the existence check

      const llModel = await llModelService.deleteLLModel(modelId);

      expect(prisma.lLModel.findUnique).toHaveBeenCalledWith({
        where: { id: modelId },
      });
      expect(prisma.lLModel.delete).not.toHaveBeenCalled();
      expect(llModel).toBeNull();
    });
  });
});
