import { Router, Request, Response } from 'express';
import { Blog } from '../models/Blog';
import { authMiddleware } from '../middleware/auth';
import { ZodError } from 'zod';
import { z } from 'zod';
import { slugify } from '../utils/slug';

const router = Router();

const BlogSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  excerpt: z.string(),
  content: z.string(),
  featuredImage: z.string().optional(),
  author: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const { published } = req.query;
    let query = {};
    
    if (published === 'true') {
      query = { isPublished: true };
    }
    
    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1 })
      .lean();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOneAndUpdate(
      { slug },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).lean();
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = BlogSchema.parse(req.body);
    
    const slug = data.slug || slugify(data.title);
    
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res.status(400).json({ error: 'A blog with this slug already exists' });
    }
    
    const blog = new Blog({
      ...data,
      slug,
      author: data.author || 'Admin',
    });
    const saved = await blog.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

router.patch('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let data = BlogSchema.partial().parse(req.body);
    
    if (data.title && !data.slug) {
      data.slug = slugify(data.title);
    }
    
    if (data.slug) {
      const existingBlog = await Blog.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existingBlog) {
        return res.status(400).json({ error: 'A blog with this slug already exists' });
      }
    }
    
    const blog = await Blog.findByIdAndUpdate(id, data, { new: true });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

export default router;
