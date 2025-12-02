import { Router, Request, Response } from 'express';
import { Experience } from '../models/Experience';
import { authMiddleware } from '../middleware/auth';
import { ZodError } from 'zod';
import { z } from 'zod';

const router = Router();

const ExperienceSchema = z.object({
  position: z.string(),
  company: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  location: z.string(),
  description: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  companyLogo: z.string().optional(),
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const experiences = await Experience.find({})
      .sort({ startDate: -1 })
      .lean();
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findById(id).lean();
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    res.json(experience);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = ExperienceSchema.parse(req.body);
    const experience = new Experience(data);
    const saved = await experience.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create experience' });
  }
});

router.patch('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = ExperienceSchema.partial().parse(req.body);
    const experience = await Experience.findByIdAndUpdate(id, data, { new: true });
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    res.json(experience);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findByIdAndDelete(id);
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

export default router;
