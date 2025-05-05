import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  ID,
  InputType,
  Field,
} from 'type-graphql';
import { Course } from '@generated/type-graphql';
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

  @Query(() => [Course], { description: 'Get all courses created by the logged-in user' })
  async myCourses(@Ctx() ctx: GraphQLContext): Promise<Course[]> {
    const userId = ctx.auth?.userId;
    if (!userId) {
      throw new AuthenticationError();
    }

    return ctx.prisma.course.findMany({
      where: { creatorId: userId },
      orderBy: { createdAt: 'desc' },
      include:{
        creator:true,
        conversation:true,
        chapters:true,
      }
    });
  }

  @Query(() => Course, { nullable: true, description: 'Get a specific course by ID, if owned by the user' })
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
    });

    if (!course) {
      // Consider throwing NotFoundError if you prefer errors over null
      // throw new NotFoundError('Course not found');
      return null;
    }

    // Authorization check
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

    return ctx.prisma.course.create({
      data: {
        ...input,
        creatorId: userId, // Associate with the logged-in user
      },
    });
  }

  @Mutation(() => Course, { description: 'Update an existing course owned by the user' })
  async updateCourse(
    @Arg('id', () => ID) id: string,
    @Arg('input') input: UpdateCourseInput,
    @Ctx() ctx: GraphQLContext
  ): Promise<Course> {
    const userId = ctx.auth?.userId;
    if (!userId) {
      throw new AuthenticationError();
    }

    // Verify ownership before updating
    const course = await ctx.prisma.course.findUnique({
      where: { id: id },
      select: { creatorId: true }, // Only fetch necessary field
    });

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    if (course.creatorId !== userId) {
      throw new ForbiddenError('You do not have permission to update this course');
    }

    // Perform the update
    return ctx.prisma.course.update({
      where: { id: id },
      data: {
        ...input,
        // Prisma automatically handles updatedAt
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
      throw new ForbiddenError('You do not have permission to delete this course');
    }

    // Perform the deletion
    await ctx.prisma.course.delete({
      where: { id: id },
    });

    return true;
  }
}
