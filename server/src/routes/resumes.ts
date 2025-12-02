import { Router, Request, Response } from 'express';
import { Resume } from '../models/Resume';
import { authMiddleware } from '../middleware/auth';
import { ZodError } from 'zod';
import { z } from 'zod';

const router = Router();

const ExperienceSchema = z.object({
  position: z.string(),
  company: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string(),
  description: z.array(z.string()),
});

const EducationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  year: z.string(),
  location: z.string(),
  details: z.string().optional(),
});

const SkillCategorySchema = z.object({
  name: z.string(),
  skills: z.array(z.string()),
});

const ResumeSchema = z.object({
  fullName: z.string(),
  title: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string(),
  profileImage: z.string().optional(),
  summary: z.string(),
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.array(SkillCategorySchema),
  isActive: z.boolean().default(true),
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const resumes = await Resume.find({}).sort({ createdAt: -1 }).lean();
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

router.get('/active', async (req: Request, res: Response) => {
  try {
    const resume = await Resume.findOne({ isActive: true }).lean();
    if (!resume) {
      return res.status(404).json({ error: 'No active resume found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active resume' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id).lean();
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = ResumeSchema.parse(req.body);

    if (data.isActive) {
      await Resume.updateMany({}, { isActive: false });
    }

    const resume = new Resume(data);
    const savedResume = await resume.save();
    res.status(201).json(savedResume);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create resume' });
  }
});

router.patch('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = ResumeSchema.partial().parse(req.body);

    if (data.isActive) {
      await Resume.updateMany({ _id: { $ne: id } }, { isActive: false });
    }

    const resume = await Resume.findByIdAndUpdate(id, data, { new: true });
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findByIdAndDelete(id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

router.patch('/:id/activate', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Resume.updateMany({}, { isActive: false });
    const resume = await Resume.findByIdAndUpdate(id, { isActive: true }, { new: true });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: 'Failed to activate resume' });
  }
});

export default router;
