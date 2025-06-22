import { Part } from "@google/genai";
import { Message } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class MessageService {
  /**
   * Finds all messages associated with a specific conversation ID, ordered by timestamp.
   * @param conversationId - The ID of the conversation to find messages for.
   * @returns A promise resolving to an array of Message objects.
   */
  async findMessagesByConversationId(
    conversationId: string
  ): Promise<Message[]> {
    console.log(
      `Fetching messages for conversation ${conversationId} via MessageService`
    );
    return prisma.message.findMany({
      where: { conversationId: conversationId },
      orderBy: {
        timestamp: "asc", // Order messages chronologically
      },
    });
  }

  /**
   * Creates a new message within a conversation.
   * @param conversationId - The ID of the conversation this message belongs to.
   * @param isUser - Boolean indicating if the message is from the user (true) or the model (false).
   * @param parts - The JSON content of the message.
   * @returns A promise resolving to the newly created Message object.
   */
  async createMessage(
    conversationId: string,
    isUser: boolean,
    parts: Part[]
  ): Promise<Message> {
    console.log(
      `Creating message for conversation ${conversationId} via MessageService`
    );
    return prisma.message.create({
      data: {
        conversationId: conversationId,
        isUser: isUser,
        parts: JSON.stringify(parts),
        // timestamp defaults to now() via @default(now())
      },
    });
  }

  // Add other message methods if needed
}
