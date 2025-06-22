import { Chapter } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class ChapterService {
  async findChaptersByCourseId(courseId: string): Promise<Chapter[]> {
    console.log(`Fetching chapters for course ${courseId} via ChapterService`);
    return prisma.chapter.findMany({
      where: { courseId: courseId },
      orderBy: {
        order: "asc",
      },
    });
  }
}
