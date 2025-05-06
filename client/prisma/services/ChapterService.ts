import { PrismaClient as PrismaClientType, Chapter as ChapterType } from '@prisma/client';


export class ChapterService {
  async findChaptersByCourseId(
    prisma: PrismaClientType,
    courseId: string
  ): Promise<ChapterType[]> {
    console.log(`Fetching chapters for course ${courseId} via ChapterService`);
    return prisma.chapter.findMany({
      where: { courseId: courseId },
      orderBy: {
        order: 'asc',
      },
    });
  }
}