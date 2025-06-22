import type { Part } from '@google/genai';
import type { Message } from '@prisma/client';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { prisma } from '@/lib/prisma';
import { MessageService } from './MessageService';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    message: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

const createMockMessage = (overrides: Partial<Message> = {}): Message => ({
  id: `msg_${Math.random().toString(36).substring(2, 15)}`,
  conversationId: 'conv123',
  isUser: true,
  parts: JSON.stringify([{ text: 'Hello' }]),
  timestamp: new Date(),
  ...overrides,
});

const createMockParts = (text = 'Test content'): Part[] => [{ text }];

describe('MessageService', () => {
  let messageService: MessageService;

  beforeEach(() => {
    messageService = new MessageService();
    vi.resetAllMocks(); // Reset mocks before each test
  });

  // --- findMessagesByConversationId ---
  describe('findMessagesByConversationId', () => {
    it('should fetch messages for a given conversation ID, ordered by timestamp', async () => {
      const conversationId = 'conv_abc_123';
      const mockMessages = [
        createMockMessage({
          conversationId,
          timestamp: new Date('2023-01-01T10:00:00Z'),
        }),
        createMockMessage({
          conversationId,
          timestamp: new Date('2023-01-01T10:05:00Z'),
        }),
      ];
      (prisma.message.findMany as Mock).mockResolvedValue(mockMessages);

      const messages =
        await messageService.findMessagesByConversationId(conversationId);

      expect(prisma.message.findMany).toHaveBeenCalledWith({
        where: { conversationId: conversationId },
        orderBy: { timestamp: 'asc' },
      });
      expect(messages).toEqual(mockMessages);
      expect(messages.length).toBe(2);
    });

    it('should return an empty array if no messages are found for the conversation', async () => {
      const conversationId = 'conv_empty_456';
      (prisma.message.findMany as Mock).mockResolvedValue([]);

      const messages =
        await messageService.findMessagesByConversationId(conversationId);

      expect(prisma.message.findMany).toHaveBeenCalledWith({
        where: { conversationId: conversationId },
        orderBy: { timestamp: 'asc' },
      });
      expect(messages).toEqual([]);
    });

    it('should log fetching attempt', async () => {
      const conversationId = 'conv_log_test_789';
      const consoleSpy = vi.spyOn(console, 'log');
      (prisma.message.findMany as Mock).mockResolvedValue([]);

      await messageService.findMessagesByConversationId(conversationId);

      expect(consoleSpy).toHaveBeenCalledWith(
        `Fetching messages for conversation ${conversationId} via MessageService`
      );
      consoleSpy.mockRestore();
    });
  });

  // --- createMessage ---
  describe('createMessage', () => {
    const conversationId = 'conv_xyz_789';

    it('should create a new user message', async () => {
      const isUser = true;
      const parts = createMockParts('User says hi');
      const expectedMessageData = {
        conversationId: conversationId,
        isUser: isUser,
        parts: JSON.stringify(parts),
      };
      const mockCreatedMessage = createMockMessage(expectedMessageData);
      (prisma.message.create as Mock).mockResolvedValue(mockCreatedMessage);

      const message = await messageService.createMessage(
        conversationId,
        isUser,
        parts
      );

      expect(prisma.message.create).toHaveBeenCalledWith({
        data: expectedMessageData,
      });
      expect(message).toEqual(mockCreatedMessage);
      expect(message.isUser).toBe(true);
      expect(message.parts).toBe(JSON.stringify(parts));
    });

    it('should create a new model message', async () => {
      const isUser = false;
      const parts = createMockParts('Model responds');
      const expectedMessageData = {
        conversationId: conversationId,
        isUser: isUser,
        parts: JSON.stringify(parts),
      };
      const mockCreatedMessage = createMockMessage(expectedMessageData);
      (prisma.message.create as Mock).mockResolvedValue(mockCreatedMessage);

      const message = await messageService.createMessage(
        conversationId,
        isUser,
        parts
      );

      expect(prisma.message.create).toHaveBeenCalledWith({
        data: expectedMessageData,
      });
      expect(message).toEqual(mockCreatedMessage);
      expect(message.isUser).toBe(false);
    });

    it('should correctly stringify the parts array', async () => {
      const isUser = true;
      const parts: Part[] = [{ text: 'First part.' }, { text: 'Second part.' }];
      const expectedMessageData = {
        conversationId: conversationId,
        isUser: isUser,
        parts: JSON.stringify(parts),
      };
      const mockCreatedMessage = createMockMessage(expectedMessageData);
      (prisma.message.create as Mock).mockResolvedValue(mockCreatedMessage);

      await messageService.createMessage(conversationId, isUser, parts);

      expect(prisma.message.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            parts: JSON.stringify(parts),
          }),
        })
      );
    });

    it('should log message creation attempt', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const parts = createMockParts();
      const mockCreatedMessage = createMockMessage();
      (prisma.message.create as Mock).mockResolvedValue(mockCreatedMessage);

      await messageService.createMessage(conversationId, true, parts);

      expect(consoleSpy).toHaveBeenCalledWith(
        `Creating message for conversation ${conversationId} via MessageService`
      );
      consoleSpy.mockRestore();
    });
  });
});
