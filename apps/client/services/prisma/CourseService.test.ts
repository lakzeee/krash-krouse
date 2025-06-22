import { Prisma } from "@prisma/client";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError, ForbiddenError } from "@/lib/errors/prisma";
import { prisma } from "@/lib/prisma";
import { CourseService } from "./CourseService";

// Mock Prisma client
vi.mock("@/lib/prisma", () => ({
  prisma: {
    course: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const defaultCourseSelect = {
  id: true,
  creatorId: true,
  conversationId: true,
  topic: true,
  goal: true,
  title: true,
  createdAt: true,
  updatedAt: true,
  isPublic: true,
};

describe("CourseService", () => {
  let courseService: CourseService;
  const userId = "user123"; // Define userId for reuse

  beforeEach(() => {
    courseService = new CourseService();
    vi.clearAllMocks(); // Clear mocks before each test
  });

  describe("findCoursesByUserId", () => {
    it("should return courses for a user with default select", async () => {
      const mockCourses = [{ id: "course1", creatorId: userId }];
      (prisma.course.findMany as any).mockResolvedValue(mockCourses);

      const courses = await courseService.findCoursesByUserId(userId);

      expect(prisma.course.findMany).toHaveBeenCalledWith({
        where: { creatorId: userId },
        orderBy: { createdAt: "desc" },
        select: defaultCourseSelect,
      });
      expect(courses).toEqual(mockCourses);
    });

    it("should return courses for a user with custom select", async () => {
      const mockCourses = [
        { id: "course1", creatorId: userId, title: "Test Course" },
      ];
      const select: Prisma.CourseSelect = {
        id: true,
        creatorId: true,
        title: true,
      };
      (prisma.course.findMany as any).mockResolvedValue(mockCourses);

      const courses = await courseService.findCoursesByUserId(userId, select);

      expect(prisma.course.findMany).toHaveBeenCalledWith({
        where: { creatorId: userId },
        orderBy: { createdAt: "desc" },
        select,
      });
      expect(courses).toEqual(mockCourses);
    });
  });

  describe("findCourseById", () => {
    const courseId = "course123";
    it("should return a course if found with default select", async () => {
      const mockCourse = { id: courseId, creatorId: userId };
      (prisma.course.findUnique as any).mockResolvedValue(mockCourse);

      const course = await courseService.findCourseById(userId, courseId);

      expect(prisma.course.findUnique).toHaveBeenCalledWith({
        where: { id: courseId, creatorId: userId },
        select: defaultCourseSelect,
      });
      expect(course).toEqual(mockCourse);
    });

    it("should return a course if found with custom select", async () => {
      const mockCourse = {
        id: courseId,
        creatorId: userId,
        title: "Test Course",
      };
      const select: Prisma.CourseSelect = {
        id: true,
        creatorId: true,
        title: true,
      };
      (prisma.course.findUnique as any).mockResolvedValue(mockCourse);

      const course = await courseService.findCourseById(
        userId,
        courseId,
        select
      );

      expect(prisma.course.findUnique).toHaveBeenCalledWith({
        where: { id: courseId, creatorId: userId },
        select,
      });
      expect(course).toEqual(mockCourse);
    });

    it("should return null if course not found", async () => {
      (prisma.course.findUnique as any).mockResolvedValue(null);

      const course = await courseService.findCourseById(userId, courseId);

      expect(prisma.course.findUnique).toHaveBeenCalledWith({
        where: { id: courseId, creatorId: userId },
        select: defaultCourseSelect,
      });
      expect(course).toBeNull();
    });
  });

  describe("createCourse", () => {
    it("should create a new course", async () => {
      const input: Prisma.CourseCreateInput = {
        topic: "Test Topic",
        goal: "Test Goal",
        title: "Test Title",
        creator: { connect: { id: userId } }, // creatorId will be set by the service method
      };
      const mockCourse = {
        id: "newCourse",
        creatorId: userId,
        topic: input.topic,
        goal: input.goal,
        title: input.title,
      };
      (prisma.course.create as any).mockResolvedValue(mockCourse);

      // Pass userId separately as per the method definition
      const course = await courseService.createCourse(userId, input);

      expect(prisma.course.create).toHaveBeenCalledWith({
        data: {
          topic: input.topic,
          goal: input.goal,
          title: input.title,
          creatorId: userId,
        },
      });
      expect(course).toEqual(mockCourse);
    });
  });

  describe("updateCourse", () => {
    const courseId = "course123";
    const input: Prisma.CourseUpdateInput = { title: "Updated Title" };

    it("should update a course if found and user is owner", async () => {
      const existingCourse = { id: courseId, creatorId: userId };
      const updatedCourse = { ...existingCourse, ...input };

      // Mock findCourseById which is called internally by updateCourse
      vi.spyOn(courseService, "findCourseById").mockResolvedValue(
        existingCourse as any
      );
      (prisma.course.update as any).mockResolvedValue(updatedCourse);

      const course = await courseService.updateCourse(userId, courseId, input);

      expect(courseService.findCourseById).toHaveBeenCalledWith(
        userId,
        courseId
      ); // findCourseById is called with userId and courseId
      expect(prisma.course.update).toHaveBeenCalledWith({
        where: { id: courseId },
        data: input,
      });
      expect(course).toEqual(updatedCourse);
    });

    it("should throw NotFoundError if course to update is not found", async () => {
      vi.spyOn(courseService, "findCourseById").mockResolvedValue(null);

      await expect(
        courseService.updateCourse(userId, courseId, input)
      ).rejects.toThrow(NotFoundError);
      expect(courseService.findCourseById).toHaveBeenCalledWith(
        userId,
        courseId
      );
      expect(prisma.course.update).not.toHaveBeenCalled();
    });

    // ForbiddenError test for updateCourse is implicitly covered by findCourseById not returning the course
    // if the userId does not match the creatorId, leading to a NotFoundError from updateCourse's perspective.
    // A direct ForbiddenError would only be thrown if findCourseById itself threw it,
    // but its current implementation returns null if not found or if creatorId doesn't match.
  });

  describe("deleteCourse", () => {
    const courseId = "course123";

    it("should delete a course if found and user is owner", async () => {
      const existingCourse = { id: courseId, creatorId: userId };
      // Mock findCourseById which is called internally by deleteCourse
      vi.spyOn(courseService, "findCourseById").mockResolvedValue(
        existingCourse as any
      );
      (prisma.course.delete as any).mockResolvedValue(existingCourse); // Prisma delete returns the deleted object

      const result = await courseService.deleteCourse(userId, courseId);

      expect(courseService.findCourseById).toHaveBeenCalledWith(
        userId,
        courseId
      );
      expect(prisma.course.delete).toHaveBeenCalledWith({
        where: { id: courseId },
      });
      expect(result).toEqual(existingCourse);
    });

    it("should throw NotFoundError if course to delete is not found", async () => {
      vi.spyOn(courseService, "findCourseById").mockResolvedValue(null);

      await expect(
        courseService.deleteCourse(userId, courseId)
      ).rejects.toThrow(NotFoundError);

      expect(courseService.findCourseById).toHaveBeenCalledWith(
        userId,
        courseId
      );

      expect(prisma.course.delete).not.toHaveBeenCalled();
    });

    // Similar to updateCourse, ForbiddenError for deleteCourse is implicitly covered.
  });
});
