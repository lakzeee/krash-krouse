export interface CreateCourseInput {
  topic: string;
  goal: string;
  title?: string | null; // Prisma schema likely allows null
  isPublic?: boolean | null; // Assuming this might be added later or optional
}

export interface UpdateCourseInput {
  topic?: string | null;
  goal?: string | null;
  title?: string | null;
  isPublic?: boolean | null;
}
