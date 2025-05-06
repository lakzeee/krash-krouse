import {
  Resolver,
  Query,
  Arg,
  Ctx,
  ID,
  FieldResolver,
  Root,
} from 'type-graphql';
import { Conversation, Message, User, LLModel, Course } from '@generated/type-graphql';
import type { GraphQLContext } from '../context';
import { AuthenticationError, ForbiddenError, NotFoundError } from '../errors';

@Resolver(Conversation)
export class ConversationResolver {
  // --- Queries --- (Using ConversationService as before)

  @Query(() => [Conversation], { description: 'Get all conversations initiated by the logged-in user', nullable: true })
  async myConversations(@Ctx() ctx: GraphQLContext): Promise<Conversation[] | null> {
    const userId = ctx.auth?.userId;
    if (!userId) throw new AuthenticationError('You must be logged in to view your conversations.');
    return ctx.services.conversationService.findConversationsByUserId(ctx.prisma, userId);
  }

  @Query(() => Conversation, { nullable: true, description: 'Get a specific conversation by ID, if owned by the user' })
  async conversationById(
    @Arg('id', () => ID) id: string,
    @Ctx() ctx: GraphQLContext
  ): Promise<Conversation | null> {
    const userId = ctx.auth?.userId;
    if (!userId) throw new AuthenticationError('Authentication required.');
    const conversation = await ctx.services.conversationService.findConversationById(ctx.prisma, id);
    if (!conversation) return null;
    if (conversation.userId !== userId) throw new ForbiddenError('You do not have permission to view this conversation');
    return conversation;
  }

  // --- Mutations --- (Add as needed)


  // --- Field Resolvers --- (Updated to use dedicated services)

  @FieldResolver(() => User, { nullable: true, description: "The user who initiated the conversation" })
  async user(
    @Root() conversation: Conversation,
    @Ctx() ctx: GraphQLContext
  ): Promise<User | null> {
    if (!conversation.userId) return null;
    console.log(`FieldResolver: Resolving user for conversation ${conversation.id} using UserService`);
    // Use UserService
    return ctx.services.userService.findUserById(ctx.prisma, conversation.userId);
  }

  @FieldResolver(() => LLModel, { nullable: true, description: "The AI model used for the conversation" })
  async aiModel( // Changed name from aiModel to match field name if needed, or keep aiModel if that's the GraphQL field name
    @Root() conversation: Conversation,
    @Ctx() ctx: GraphQLContext
  ): Promise<LLModel | null> {
    if (!conversation.aiModelId) return null;
    console.log(`FieldResolver: Resolving aiModel for conversation ${conversation.id} using LLModelService`);
    // Use LLModelService
    return ctx.services.llmodelService.findLLModelById(ctx.prisma, conversation.aiModelId);
  }

   @FieldResolver(() => Course, { nullable: true, description: "The course generated from this conversation" })
   async course(
     @Root() conversation: Conversation,
     @Ctx() ctx: GraphQLContext
   ): Promise<Course | null> {
     console.log(`FieldResolver: Resolving course for conversation ${conversation.id} using CourseService`);
     // Use CourseService - ensure it has findCourseByConversationId or adapt
     return ctx.services.courseService.findCourseByConversationId(ctx.prisma, conversation.id);
   }

  @FieldResolver(() => [Message], { description: "The messages within the conversation" })
  async messages(
    @Root() conversation: Conversation,
    @Ctx() ctx: GraphQLContext
  ): Promise<Message[]> {
    console.log(`FieldResolver: Resolving messages for conversation ${conversation.id} using MessageService`);
    // Use MessageService
    return ctx.services.messageService.findMessagesByConversationId(
      ctx.prisma,
      conversation.id
    );
  }
}
