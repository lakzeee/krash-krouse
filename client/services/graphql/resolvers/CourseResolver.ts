import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  FieldResolver,
  Root,
  ID,
} from 'type-graphql';
import type { Course as PrismaCourse, Chapter as PrismaChapter, User as PrismaUser } from '@prisma/client';
import { CourseService, ChapterService, UserService } from '@/services/prisma';
import { CreateCourseInput, UpdateCourseInput, Course, Chapter, User } from '@/types/graphql';
import type { GraphQLContext } from '../context';

@Resolver(() => Course)
export class CourseResolver {
  private courseService: CourseService;
  private chapterService: ChapterService;
  private userService: UserService;

  constructor() {
    this.courseService = new CourseService();
    this.chapterService = new ChapterService();
    this.userService = new UserService();
  }

  @Query(() => [Course])
  async courses(@Ctx() { auth }: GraphQLContext): Promise<PrismaCourse[]> {
    if (!auth.userId) throw new Error('Not authenticated');
    return this.courseService.findCoursesByUserId(auth.userId, {
      id: true,
      creatorId: true,
      conversationId: true,
      topic: true,
      goal: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      isPublic: true,
    });
  }

  @Query(() => Course, { nullable: true })
  async course(
    @Arg('id', () => ID) id: string,
    @Ctx() { auth }: GraphQLContext
  ): Promise<PrismaCourse | null> {
    if (!auth.userId) throw new Error('Not authenticated');
    return this.courseService.findCourseById(id, {
      id: true,
      creatorId: true,
      conversationId: true,
      topic: true,
      goal: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      isPublic: true,
    });
  }

  @Mutation(() => Course)
  async createCourse(
    @Arg('input') input: CreateCourseInput,
    @Ctx() { auth }: GraphQLContext
  ): Promise<PrismaCourse> {
    if (!auth.userId) throw new Error('Not authenticated');
    return this.courseService.createCourse(auth.userId, input);
  }

  @Mutation(() => Course)
  async updateCourse(
    @Arg('id', () => ID) id: string,
    @Arg('input') input: UpdateCourseInput,
    @Ctx() { auth }: GraphQLContext
  ): Promise<PrismaCourse> {
    if (!auth.userId) throw new Error('Not authenticated');
    return this.courseService.updateCourse(auth.userId, id, input);
  }

  @Mutation(() => Boolean)
  async deleteCourse(
    @Arg('id', () => ID) id: string,
    @Ctx() { auth }: GraphQLContext
  ): Promise<boolean> {
    if (!auth.userId) throw new Error('Not authenticated');
    return this.courseService.deleteCourse(auth.userId, id);
  }

  @FieldResolver(() => [Chapter])
  async chapters(@Root() course: PrismaCourse): Promise<PrismaChapter[]> {
    return this.chapterService.findChaptersByCourseId(course.id);
  }

  @FieldResolver(() => User)
  async creator(@Root() course: PrismaCourse): Promise<PrismaUser> {
    const user = await this.userService.findUserById(course.creatorId);
    if (!user) throw new Error('Creator not found');
    return user;
  }
}

