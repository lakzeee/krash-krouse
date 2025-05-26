import { z } from 'zod';

export type NewCourseRequestBody = {
  message: string;
};

export const NewCourseRequestBodySchema = z.object({
  message: z.string(),
});

export interface UpdateConversationRequestBody {}
