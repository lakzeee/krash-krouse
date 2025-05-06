import { NotFoundError } from "@/graphql";
import { Conversation, Message, PrismaClient } from "@prisma/client";

export class ConversationService {
  /**
   * Finds all conversations associated with a specific user ID.
   * @param prisma - The PrismaClient instance.
   * @param userId - The ID of the user whose conversations to find.
   * @returns A promise resolving to an array of Conversation objects.
   */
  async findConversationsByUserId(
    prisma: PrismaClient,
    userId: string
  ): Promise<Conversation[]> {
    console.log(
      `Fetching conversations for user ${userId} via ConversationService`
    );
    return prisma.conversation.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      // Include relations commonly needed when listing conversations
      // include: { aiModel: true }
    });
  }

  /**
   * Finds a single conversation by its ID.
   * @param prisma - The PrismaClient instance.
   * * @param conversationId - The ID of the conversation to find.
   * @returns A promise resolving to the Conversation object or null if not found.
   */
  async findConversationById(
    prisma: PrismaClient,
    conversationId: string
  ): Promise<Conversation | null> {
    console.log(
      `Fetching conversation ${conversationId} via ConversationService`
    );
    return prisma.conversation.findUnique({
      where: { id: conversationId },
      // Include relations commonly needed when viewing a single conversation
      // include: { messages: { orderBy: { timestamp: 'asc' } }, aiModel: true, user: true }
    });
  }

  /**
   * Creates a new conversation.
   * Typically called when starting a process like course generation.
   * @param prisma - The PrismaClient instance.
   * @param userId - The ID of the user initiating the conversation.
   * @param systemPrompt - Optional initial system prompt.
   * @param aiModelId - Optional ID of the AI model being used.
   * @returns A promise resolving to the newly created Conversation object.
   */
  async createConversation(
    prisma: PrismaClient,
    userId: string,
    systemPrompt?: string,
    aiModelId?: string
  ): Promise<Conversation> {
    console.log(
      `Creating conversation for user ${userId} via ConversationService`
    );
    return prisma.conversation.create({
      data: {
        userId: userId,
        systemPrompt: systemPrompt,
        aiModelId: aiModelId,
      },
    });
  }

  /**
   * Updates a conversation, e.g., linking it to a course or setting the model.
   * @param prisma - The PrismaClient instance.
   * @param conversationId - The ID of the conversation to update.
   * @param data - The data to update.
   * @returns A promise resolving to the updated Conversation object.
   * @throws NotFoundError if the conversation doesn't exist.
   */
  async updateConversation(
    prisma: PrismaClient,
    conversationId: string,
    data: { courseId?: string; aiModelId?: string; systemPrompt?: string }
  ): Promise<Conversation> {
    console.log(
      `Updating conversation ${conversationId} via ConversationService`
    );
    // Check if exists first (optional, update throws if not found)
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
