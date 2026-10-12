import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.object({
    city: z.string(),
    geo: z.object({
      lat: z.string(),
      lng: z.string(),
    }),
  }),
});

export const usersSchema = z.array(userSchema);
