import { Conversation, Prisma } from '@prisma/client';
import { NotFoundError } from '@/lib/errors/prisma';
import { prisma } from '@/lib/prisma';

export class ConversationService {
  /**
   * Finds all conversations associated with a specific user ID.
   * @param userId - The ID of the user whose conversations to find.
   * @returns A promise resolving to an array of Conversation objects.
   */
  async findConversationsByUserId(userId: string): Promise<Conversation[]> {
    console.log(
      `Fetching conversations for user ${userId} via ConversationService`
    );
    return prisma.conversation.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Finds a single conversation by its ID.
   * @param conversationId - The ID of the conversation to find.
   * @returns A promise resolving to the Conversation object or null if not found.
   */
  async findConversationById(
    conversationId: string
  ): Promise<Conversation | null> {
    console.log(
      `Fetching conversation ${conversationId} via ConversationService`
    );
    return prisma.conversation.findUnique({
      where: { id: conversationId },
    });
  }

  /**
   * Creates a new conversation.
   * Typically called when starting a process like course generation.
   * @param userId - The ID of the user initiating the conversation.
   * @param systemPrompt - Optional initial system prompt.
   * @param aiModelId - Optional ID of the AI model being used.
   * @returns A promise resolving to the newly created Conversation object.
   */
  async createConversation(
    input: Prisma.ConversationCreateInput
  ): Promise<Conversation> {
    console.log(
      `Creating conversation for user ${input?.user?.connect?.id} via ConversationService`
    );

    return prisma.conversation.create({
      data: input,
      include: {
        messages: true,
      },
    });
  }

  /**
   * Updates a conversation, e.g., linking it to a course or setting the model.
   * @param conversationId - The ID of the conversation to update.
   * @param data - The data to update.
   * @returns A promise resolving to the updated Conversation object.
   * @throws NotFoundError if the conversation doesn't exist.
   */
  async updateConversation(
    conversationId: string,
    data: { courseId?: string; aiModelId?: string; systemPrompt?: string }
  ): Promise<Conversation> {
    console.log(
      `Updating conversation ${conversationId} via ConversationService`
    );
    const existing = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundError(
        `Conversation with ID ${conversationId} not found.`
      );
    }

    return prisma.conversation.update({
      where: { id: conversationId },
      data: data,
    });
  }
}
