import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundError } from '@/lib/errors/prisma';
import { prisma } from '@/lib/prisma';
import { ConversationService } from './ConversationService';

// Mock Prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    conversation: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('ConversationService', () => {
  let conversationService: ConversationService;

  beforeEach(() => {
    conversationService = new ConversationService();
    vi.clearAllMocks(); // Clear mocks before each test
  });

  describe('findConversationsByUserId', () => {
    it('should return conversations for a user', async () => {
      const userId = 'user123';
      const mockConversations = [
        { id: 'conv1', userId },
        { id: 'conv2', userId },
      ];
      (prisma.conversation.findMany as any).mockResolvedValue(
        mockConversations
      );

      const conversations =
        await conversationService.findConversationsByUserId(userId);

      expect(prisma.conversation.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      expect(conversations).toEqual(mockConversations);
    });
  });

  describe('findConversationById', () => {
    it('should return a conversation if found', async () => {
      const userId = 'user123';
      const conversationId = 'conv123';
      const mockConversation = { id: conversationId, userId };
      (prisma.conversation.findUnique as any).mockResolvedValue(
        mockConversation
      );

      const conversation = await conversationService.findConversationById(
        userId,
        conversationId
      );

      expect(prisma.conversation.findUnique).toHaveBeenCalledWith({
        where: { id: conversationId, userId },
      });
      expect(conversation).toEqual(mockConversation);
    });

    it('should return null if conversation not found', async () => {
      const userId = 'user123';
      const conversationId = 'conv123';
      (prisma.conversation.findUnique as any).mockResolvedValue(null);

      const conversation = await conversationService.findConversationById(
        userId,
        conversationId
      );

      expect(prisma.conversation.findUnique).toHaveBeenCalledWith({
        where: { id: conversationId, userId },
      });
      expect(conversation).toBeNull();
    });
  });

  describe('createConversation', () => {
    it('should create a new conversation', async () => {
      const input = { user: { connect: { id: 'user123' } } };
      const mockConversation = { id: 'newConv', ...input };
      (prisma.conversation.create as any).mockResolvedValue(mockConversation);

      const conversation = await conversationService.createConversation(
        input as any
      );

      expect(prisma.conversation.create).toHaveBeenCalledWith({
        data: input,
        include: {
          messages: true,
        },
      });
      expect(conversation).toEqual(mockConversation);
    });
  });

  describe('updateConversation', () => {
    it('should update a conversation if found', async () => {
      const userId = 'user123';
      const conversationId = 'conv123';
      const updateData = { courseId: 'course456' };
      const existingConversation = { id: conversationId, userId };
      const updatedConversation = { ...existingConversation, ...updateData };

      // Mock findConversationById
      vi.spyOn(conversationService, 'findConversationById').mockResolvedValue(
        existingConversation as any
      );
      (prisma.conversation.update as any).mockResolvedValue(
        updatedConversation
      );

      const conversation = await conversationService.updateConversation(
        userId,
        conversationId,
        updateData
      );

      expect(conversationService.findConversationById).toHaveBeenCalledWith(
        userId,
        conversationId
      );
      expect(prisma.conversation.update).toHaveBeenCalledWith({
        where: { id: conversationId },
        data: updateData,
      });
      expect(conversation).toEqual(updatedConversation);
    });

    it('should throw NotFoundError if conversation to update is not found', async () => {
      const userId = 'user123';
      const conversationId = 'conv123';
      const updateData = { courseId: 'course456' };

      vi.spyOn(conversationService, 'findConversationById').mockResolvedValue(
        null
      );

      await expect(
        conversationService.updateConversation(
          userId,
          conversationId,
          updateData
        )
      ).rejects.toThrow(NotFoundError);
      expect(conversationService.findConversationById).toHaveBeenCalledWith(
        userId,
        conversationId
      );
      expect(prisma.conversation.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteConversation', () => {
    it('should delete a conversation if found', async () => {
      const userId = 'user123';
      const conversationId = 'conv123';
      const existingConversation = { id: conversationId, userId };

      // Mock findConversationById
      vi.spyOn(conversationService, 'findConversationById').mockResolvedValue(
        existingConversation as any
      );
      (prisma.conversation.delete as any).mockResolvedValue(
        existingConversation
      );

      const conversation = await conversationService.deleteConversation(
        userId,
        conversationId
      );

      expect(conversationService.findConversationById).toHaveBeenCalledWith(
        userId,
        conversationId
      );
      expect(prisma.conversation.delete).toHaveBeenCalledWith({
        where: { id: conversationId },
      });
      expect(conversation).toEqual(existingConversation);
    });

    it('should throw NotFoundError if conversation to delete is not found', async () => {
      const userId = 'user123';
      const conversationId = 'conv123';

      vi.spyOn(conversationService, 'findConversationById').mockResolvedValue(
        null
      );

      await expect(
        conversationService.deleteConversation(userId, conversationId)
      ).rejects.toThrow(NotFoundError);
      expect(conversationService.findConversationById).toHaveBeenCalledWith(
        userId,
        conversationId
      );
      expect(prisma.conversation.delete).not.toHaveBeenCalled();
    });
  });
});
