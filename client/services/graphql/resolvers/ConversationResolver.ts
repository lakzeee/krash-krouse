import {
  Resolver,
  Query,
  Arg,
  Ctx,
  ID,
  FieldResolver,
  Root,
  Mutation,
} from 'type-graphql';
import { Conversation, Message, User, LLModel, Course } from '@generated/type-graphql';
import type { GraphQLContext } from '../context';
import { AuthenticationError, ForbiddenError } from '../errors';

import { CreateConversationInput, UpdateConversationInput } from '@/types/graphql';

@Resolver(Conversation)
export class ConversationResolver {
  // --- Queries --- (Using ConversationService as before)

  @Query(() => [Conversation], { description: 'Get all conversations initiated by the logged-in user', nullable: true })
  async myConversations(@Ctx() ctx: GraphQLContext): Promise<Conversation[] | null> {
    const userId = ctx.auth?.userId;
    if (!userId) throw new AuthenticationError('You must be logged in to view your conversations.');
    return ctx.services.conversationService.findConversationsByUserId(userId);
  }

  @Query(() => Conversation, { nullable: true, description: 'Get a specific conversation by ID, if owned by the user' })
  async conversationById(
    @Arg('id', () => ID) id: string,
    @Ctx() ctx: GraphQLContext
  ): Promise<Conversation | null> {
    const userId = ctx.auth?.userId;
    if (!userId) throw new AuthenticationError('Authentication required.');
    const conversation = await ctx.services.conversationService.findConversationById(id);
    if (!conversation) return null;
    if (conversation.userId !== userId) throw new ForbiddenError('You do not have permission to view this conversation');
    return conversation;
  }

  // --- Mutations --- (Add as needed)

  @Mutation(() => Conversation)
  async createConversation(
    @Arg('input') input: CreateConversationInput,
    @Ctx() { auth, services }: GraphQLContext
  ): Promise<Conversation> {
    if (!auth.userId) {
      throw new AuthenticationError('User must be authenticated to create a conversation');
    }

    return services.conversationService.createConversation(
      auth.userId,
      input.systemPrompt,
      input.aiModelId
    );
  }

  @Mutation(() => Conversation)
  async updateConversation(
    @Arg('conversationId') conversationId: string,
    @Arg('input') input: UpdateConversationInput,
    @Ctx() { auth, services }: GraphQLContext
  ): Promise<Conversation> {
    if (!auth.userId) {
      throw new AuthenticationError('User must be authenticated to update a conversation');
    }

    return services.conversationService.updateConversation(
      conversationId,
      {
        courseId: input.courseId,
        aiModelId: input.aiModelId,
        systemPrompt: input.systemPrompt,
      }
    );
  }

  // --- Field Resolvers --- (Updated to use dedicated services)

  @FieldResolver(() => User, { nullable: true, description: "The user who initiated the conversation" })
  async user(
    @Root() conversation: Conversation,
    @Ctx() ctx: GraphQLContext
  ): Promise<User | null> {
    if (!conversation.userId) return null;
    console.log(`FieldResolver: Resolving user for conversation ${conversation.id} using UserService`);
    return ctx.services.userService.findUserById(conversation.userId);
  }

  @FieldResolver(() => LLModel, { nullable: true, description: "The AI model used for the conversation" })
  async aiModel(
    @Root() conversation: Conversation,
    @Ctx() ctx: GraphQLContext
  ): Promise<LLModel | null> {
    if (!conversation.aiModelId) return null;
    console.log(`FieldResolver: Resolving aiModel for conversation ${conversation.id} using LLModelService`);
    return ctx.services.llmodelService.findLLModelById(conversation.aiModelId);
  }

  @FieldResolver(() => Course, { nullable: true, description: "The course generated from this conversation" })
  async course(
    @Root() conversation: Conversation,
    @Ctx() ctx: GraphQLContext
  ): Promise<Course | null> {
    console.log(`FieldResolver: Resolving course for conversation ${conversation.id} using CourseService`);
    return ctx.services.courseService.findCourseByConversationId(conversation.id);
  }

  @FieldResolver(() => [Message], { description: "The messages within the conversation" })
  async messages(
    @Root() conversation: Conversation,
    @Ctx() ctx: GraphQLContext
  ): Promise<Message[]> {
    console.log(`FieldResolver: Resolving messages for conversation ${conversation.id} using MessageService`);
    return ctx.services.messageService.findMessagesByConversationId(conversation.id);
  }
}
