import { Chapter, ChapterStatus, Prisma } from '@prisma/client';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import { ChapterService } from './ChapterService';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    chapter: {
      findMany: vi.fn(),
    },
  },
}));

describe('ChapterService', () => {
  let chapterService: ChapterService;

  beforeEach(() => {
    chapterService = new ChapterService();
    vi.clearAllMocks(); // Clear mocks before each test
  });

  describe('findChaptersByCourseId', () => {
    it('should return chapters for a given course ID, ordered by "order"', async () => {
      const courseId = 'test-course-id';
      const mockChapters: Chapter[] = [
        {
          id: 'chap1',
          courseId,
          title: 'Chapter 1',
          content: { text: 'Content 1' } as Prisma.JsonValue,
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: ChapterStatus.NOT_STARTED,
          objectives: ['Objective 1'],
        },
        {
          id: 'chap2',
          courseId,
          title: 'Chapter 2',
          content: { text: 'Content 2' } as Prisma.JsonValue,
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: ChapterStatus.IN_PROGRESS,
          objectives: ['Objective 2'],
        },
      ];

      // Setup the mock for prisma.chapter.findMany
      (prisma.chapter.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockChapters
      );

      const chapters = await chapterService.findChaptersByCourseId(courseId);

      expect(prisma.chapter.findMany).toHaveBeenCalledWith({
        where: { courseId: courseId },
        orderBy: {
          order: 'asc',
        },
      });
      expect(chapters).toEqual(mockChapters);
      expect(chapters.length).toBe(2);
      expect(chapters[0].order).toBe(1);
      expect(chapters[1].order).toBe(2);
    });

    it('should return an empty array if no chapters are found', async () => {
      const courseId = 'non-existent-course-id';
      (prisma.chapter.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(
        []
      );

      const chapters = await chapterService.findChaptersByCourseId(courseId);

      expect(prisma.chapter.findMany).toHaveBeenCalledWith({
        where: { courseId: courseId },
        orderBy: {
          order: 'asc',
        },
      });
      expect(chapters).toEqual([]);
      expect(chapters.length).toBe(0);
    });

    it('should handle errors from prisma.chapter.findMany', async () => {
      const courseId = 'error-course-id';
      const errorMessage = 'Database error';
      (prisma.chapter.findMany as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        chapterService.findChaptersByCourseId(courseId)
      ).rejects.toThrow(errorMessage);

      expect(prisma.chapter.findMany).toHaveBeenCalledWith({
        where: { courseId: courseId },
        orderBy: {
          order: 'asc',
        },
      });
    });
  });
});
