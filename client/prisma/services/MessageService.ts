import { Message, PrismaClient } from "@prisma/client";

export class MessageService {
  /**
   * Finds all messages associated with a specific conversation ID, ordered by timestamp.
   * @param prisma - The PrismaClient instance.
   * @param conversationId - The ID of the conversation to find messages for.
   * @returns A promise resolving to an array of Message objects.
   */
  async findMessagesByConversationId(
    prisma: PrismaClient,
    conversationId: string
  ): Promise<Message[]> {
    console.log(
      `Fetching messages for conversation ${conversationId} via MessageService`
    );
    return prisma.message.findMany({
      where: { conversationId: conversationId },
      orderBy: {
        timestamp: 'asc', // Order messages chronologically
      },
    });
  }

  /**
   * Creates a new message within a conversation.
   * @param prisma - The PrismaClient instance.
   * @param conversationId - The ID of the conversation this message belongs to.
   * @param isUser - Boolean indicating if the message is from the user (true) or the model (false).
   * @param parts - The JSON content of the message.
   * @returns A promise resolving to the newly created Message object.
   */
  async createMessage(
    prisma: PrismaClient,
    conversationId: string,
    isUser: boolean,
    parts: any // Use a more specific type based on your MessageParts definition
  ): Promise<Message> {
    console.log(
      `Creating message for conversation ${conversationId} via MessageService`
    );
    return prisma.message.create({
      data: {
        conversationId: conversationId,
        isUser: isUser,
        parts: parts,
        // timestamp defaults to now() via @default(now())
      },
    });
  }

  // Add other message methods if needed
}
