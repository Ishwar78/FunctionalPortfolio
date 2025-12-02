import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const ProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  short_description: z.string().min(1, 'Short description is required'),
  detailed_description: z.string().optional(),
  tech_stack: z.array(z.string()).optional().default([]),
  category: z.string().optional(),
  cover_image_url: z.string().url().optional().or(z.literal('')),
  github_url: z.string().url().optional().or(z.literal('')),
  live_url: z.string().url().optional().or(z.literal('')),
  is_featured: z.boolean().optional().default(false),
  display_order: z.number().optional().default(0),
  readme_content: z.string().optional(),
});

export const ContentSectionSchema = z.object({
  key: z.enum([
    'hero',
    'about',
    'skills',
    'banners',
    'contact',
    'social',
    'backgrounds',   // 👈 ye naya add karo
  ]),
  content: z.record(z.any()),
});


export const MessageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type ProjectInput = z.infer<typeof ProjectSchema>;
export type ContentSectionInput = z.infer<typeof ContentSectionSchema>;
export type MessageInput = z.infer<typeof MessageSchema>;
