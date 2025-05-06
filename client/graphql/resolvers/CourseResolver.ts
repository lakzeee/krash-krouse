import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  ID,
  InputType,
  Field,
  FieldResolver,
  Root,
} from 'type-graphql';
import { Course, Chapter } from '@generated/type-graphql';
import type { GraphQLContext } from '../context';
import { AuthenticationError, ForbiddenError } from '../errors';


@InputType()
export class CreateCourseInput { // Export if needed elsewhere
  @Field()
  topic!: string;

  @Field()
  goal!: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true, defaultValue: false })
  isPublic?: boolean;
}

@InputType()
export class UpdateCourseInput { // Export if needed elsewhere
  @Field({ nullable: true })
  topic?: string;

  @Field({ nullable: true })
  goal?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  isPublic?: boolean;
}


// --- Resolver ---

@Resolver(Course)
export class CourseResolver {
  // --- Queries ---

  @Query(() => [Course], {
    description: 'Get all courses created by the logged-in user',
  })
  async myCourses(@Ctx() ctx: GraphQLContext): Promise<Course[]> {
    const userId = ctx.auth?.userId;
    if (!userId) {
      throw new AuthenticationError();
    }
    // Delegate database logic to the service
    return ctx.services.courseService.findCoursesByUserId(ctx.prisma, userId);
  }

  @Query(() => Course, {
    nullable: true,
    description: 'Get a specific course by ID, if owned by the user',
  })
  async courseById(
    @Arg('id', () => ID) id: string,
    @Ctx() ctx: GraphQLContext
  ): Promise<Course | null> {
    const userId = ctx.auth?.userId;
    if (!userId) {
      throw new AuthenticationError('Authentication required to view specific course details.');
    }

    // Delegate fetching to the service
    const course = await ctx.services.courseService.findCourseById(ctx.prisma, id);

    if (!course) {
      return null; // Or throw NotFoundError
    }

    // Authorization check remains in the resolver (or could be moved to service)
    // Adjust based on your 'Course' model fields (e.g., isPublic)
    if (course.creatorId !== userId) {
       throw new ForbiddenError('You do not have permission to view this course');
    }

    return course;
  }

  // --- Mutations ---

  @Mutation(() => Course, { description: 'Create a new course' })
  async createCourse(
    @Arg('input') input: CreateCourseInput,
    @Ctx() ctx: GraphQLContext
  ): Promise<Course> {
    const userId = ctx.auth?.userId;
    if (!userId) {
      throw new AuthenticationError();
    }
    // Delegate creation to the service
    return ctx.services.courseService.createCourse(ctx.prisma, userId, input);
  }

  @Mutation(() => Course, {
    description: 'Update an existing course owned by the user',
  })
  async updateCourse(
    @Arg('id', () => ID) id: string,
    @Arg('input') input: UpdateCourseInput,
    @Ctx() ctx: GraphQLContext
  ): Promise<Course> {
    const userId = ctx.auth?.userId;
    if (!userId) {
      throw new AuthenticationError();
    }
    // Delegate update (including authorization check) to the service
    return ctx.services.courseService.updateCourse(ctx.prisma, userId, id, input);
  }

  @Mutation(() => Boolean, { description: 'Delete a course owned by the user' })
  async deleteCourse(
    @Arg('id', () => ID) id: string,
    @Ctx() ctx: GraphQLContext
  ): Promise<boolean> {
    const userId = ctx.auth?.userId;
    if (!userId) {
      throw new AuthenticationError();
    }
    // Delegate deletion (including authorization check) to the service
    return ctx.services.courseService.deleteCourse(ctx.prisma, userId, id);
  }


  // --- Field Resolvers ---

  // FieldResolver using the ChapterService from context
  @FieldResolver(() => [Chapter], { description: 'Chapters for the course' })
  async chapters(
    @Root() course: Course, // The parent Course object
    @Ctx() ctx: GraphQLContext // The GraphQL context with services
  ): Promise<Chapter[]> {
    // Delegate fetching chapters to the ChapterService
    return ctx.services.chapterService.findChaptersByCourseId(
      ctx.prisma,
      course.id
    );
  }

  // Add other FieldResolvers if needed (e.g., for the 'creator' field)
  // @FieldResolver(() => User)
  // async creator(@Root() course: Course, @Ctx() ctx: GraphQLContext): Promise<User | null> {
  //   // Could create a UserService or just use prisma directly if simple
  //   return ctx.prisma.user.findUnique({ where: { id: course.creatorId } });
  // }
}

