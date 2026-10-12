import { z } from 'zod';

export const postSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string().trim().min(1, { message: 'Title is required' }),
  body: z.string().trim().min(1, { message: 'Body is required' }),
});

export const postsSchema = z.array(postSchema);
