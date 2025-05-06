import { PrismaClient } from "@prisma/client";
import { Course } from "@prisma/client";
import { NotFoundError, ForbiddenError } from "@/graphql/errors/customErrors";
import { CreateCourseInput, UpdateCourseInput } from "@/graphql";


export class CourseService {
  /**
   * Finds all courses created by a specific user.
   * @param prisma - The PrismaClient instance.
   * @param userId - The ID of the user whose courses to find.
   * @returns A promise resolving to an array of Course objects.
   */
  async findCoursesByUserId(
    prisma: PrismaClient,
    userId: string
  ): Promise<Course[]> {
    console.log(`Fetching courses for user ${userId} via CourseService`);
    return prisma.course.findMany({
      where: { creatorId: userId },
      orderBy: { createdAt: 'desc' },
      // Decide includes based on common needs or let GraphQL resolve relations
      // include: { chapters: true }
    });
  }

  /**
   * Finds a single course by its ID.
   * @param prisma - The PrismaClient instance.
   * @param courseId - The ID of the course to find.
   * @returns A promise resolving to the Course object or null if not found.
   */
  async findCourseById(
    prisma: PrismaClient,
    courseId: string
  ): Promise<Course | null> {
    console.log(`Fetching course ${courseId} via CourseService`);
    return prisma.course.findUnique({
      where: { id: courseId },
      // Include necessary relations if needed by default for this fetch
      // include: { chapters: true }
    });
  }

  /**
   * Creates a new course for a given user.
   * @param prisma - The PrismaClient instance.
   * @param userId - The ID of the user creating the course.
   * @param input - The data for the new course.
   * @returns A promise resolving to the newly created Course object.
   */
  async createCourse(
    prisma: PrismaClient,
    userId: string,
    input: CreateCourseInput
  ): Promise<Course> {
    console.log(`Creating course for user ${userId} via CourseService`);
    return prisma.course.create({
      data: {
        topic: input.topic,
        goal: input.goal,
        title: input.title,
        // isPublic: input.isPublic, // Example based on input type
        creatorId: userId,
      },
    });
  }

  /**
   * Updates an existing course. Performs authorization check.
   * @param prisma - The PrismaClient instance.
   * @param userId - The ID of the user attempting the update (for authorization).
   * @param courseId - The ID of the course to update.
   * @param input - The data to update the course with.
   * @returns A promise resolving to the updated Course object.
   * @throws NotFoundError if the course doesn't exist.
   * @throws ForbiddenError if the user doesn't own the course.
   */
  async updateCourse(
    prisma: PrismaClient,
    userId: string,
    courseId: string,
    input: UpdateCourseInput
  ): Promise<Course> {
    console.log(
      `Updating course ${courseId} for user ${userId} via CourseService`
    );
    // Verify ownership first
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { creatorId: true }, // Only select necessary field for check
    });

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    if (course.creatorId !== userId) {
      throw new ForbiddenError(
        'You do not have permission to update this course'
      );
    }

    // Perform the update
    return prisma.course.update({
      where: { id: courseId },
      data: {
        // Spread only the fields present in the input
        ...(input.topic && { topic: input.topic }),
        ...(input.goal && { goal: input.goal }),
        ...(input.title && { title: input.title }),
        // ...(input.isPublic !== undefined && { isPublic: input.isPublic }), // Handle boolean update
      },
    });
  }

  /**
   * Deletes a course. Performs authorization check.
   * @param prisma - The PrismaClient instance.
   * @param userId - The ID of the user attempting the deletion (for authorization).
   * @param courseId - The ID of the course to delete.
   * @returns A promise resolving to true if deletion was successful.
   * @throws NotFoundError if the course doesn't exist.
   * @throws ForbiddenError if the user doesn't own the course.
   */
  async deleteCourse(
    prisma: PrismaClient,
    userId: string,
    courseId: string
  ): Promise<boolean> {
    console.log(
      `Deleting course ${courseId} for user ${userId} via CourseService`
    );
    // Verify ownership before deleting
    const course = await prisma.course.findUnique({
      where: { id: courseId },
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
    await prisma.course.delete({
      where: { id: courseId },
    });

    return true;
  }

  async findCourseByConversationId(
    prisma: PrismaClient,
    conversationId: string
  ): Promise<Course | null> {
    console.log(
      `Fetching course by conversation ${conversationId} via CourseService`
    );
    return prisma.course.findUnique({
      select: {
        id: true,
        creatorId: true,
        conversationId: true,
        topic: true,
        goal: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        isPublic: true,
        creator: true,
        conversation: true,
        chapters: true,
      },
      where: { conversationId: conversationId },
    });
  }
}