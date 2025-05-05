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
import { AuthenticationError, NotFoundError, ForbiddenError } from '../errors';

// --- Input Types ---

@InputType()
class CreateCourseInput {
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
class UpdateCourseInput {
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

    return ctx.prisma.course.findMany({
      where: { creatorId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        creator: true,
        conversation: true,
        chapters: {
          include: {
            quizzes: true,
          },
        },
      },
    });
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
      throw new AuthenticationError();
    }

    const course = await ctx.prisma.course.findUnique({
      where: { id: id },
      include: {
        chapters: true,
      },
    });

    if (!course) {
      return null;
    }

    if (course.creatorId !== userId) {
      throw new ForbiddenError(
        'You do not have permission to view this course'
      );
    }

    return course;
  }

  @Mutation(() => Course, { description: 'Create a new course' })
  async createCourse(
    @Arg('input') input: CreateCourseInput,
    @Ctx() ctx: GraphQLContext
  ): Promise<Course> {
    const userId = ctx.auth?.userId;
    if (!userId) {
      throw new AuthenticationError();
    }

    return ctx.prisma.course.create({
      data: {
        ...input,
        creatorId: userId,
      },
    });
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

    const course = await ctx.prisma.course.findUnique({
      where: { id: id },
      select: { creatorId: true },
    });

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    if (course.creatorId !== userId) {
      throw new ForbiddenError(
        'You do not have permission to update this course'
      );
    }

    return ctx.prisma.course.update({
      where: { id: id },
      data: {
        ...input,
      },
    });
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

    // Verify ownership before deleting
    const course = await ctx.prisma.course.findUnique({
      where: { id: id },
      select: { creatorId: true },
    });

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    if (course.creatorId !== userId) {
      throw new ForbiddenError(
        'You do not have permission to delete this course'
      );
    }

    // Perform the deletion
    await ctx.prisma.course.delete({
      where: { id: id },
    });

    return true;
  }

  @FieldResolver(() => [Chapter], { description: 'Chapters for the course' })
  async chapters(
    @Root() course: Course,
    @Ctx() ctx: GraphQLContext
  ): Promise<Chapter[]> {
    if (course.chapters) {
      return course.chapters;
    }
    console.warn(
      `Manually fetching chapters for course ${course.id} in FieldResolver`
    );
    return ctx.prisma.chapter.findMany({
      where: { courseId: course.id },
      // Include nested relations if needed here
      // include: { quizzes: true }
    });
  }
}
