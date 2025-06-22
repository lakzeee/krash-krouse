import { z } from 'zod';

export type NewCourseRequestBody = {
  message: string;
};

export const NewCourseRequestBodySchema = z.object({
  message: z.string(),
});

export type UpdateConversationRequestBody = {
  message: string;
  action: 'learning-options' | 'learning-objective';
};

export const UpdateConversationRequestBodySchema = z.object({
  message: z.string(),
  action: z.enum(['learning-options', 'learning-objective']),
});
