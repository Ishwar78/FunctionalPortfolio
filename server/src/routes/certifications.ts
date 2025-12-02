import { Router, Request, Response } from 'express';
import { Certification } from '../models/Certification';
import { authMiddleware } from '../middleware/auth';
import { ZodError } from 'zod';
import { z } from 'zod';

const router = Router();

const CertificationSchema = z.object({
  title: z.string(),
  issuer: z.string(),
  issueDate: z.string(),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().optional(),
  certificateImage: z.string().optional(),
  description: z.string().optional(),
  skills: z.array(z.string()).default([]),
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const certifications = await Certification.find({})
      .sort({ issueDate: -1 })
      .lean();
    res.json(certifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certifications' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const certification = await Certification.findById(id).lean();
    if (!certification) {
      return res.status(404).json({ error: 'Certification not found' });
    }
    res.json(certification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certification' });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = CertificationSchema.parse(req.body);
    const certification = new Certification(data);
    const saved = await certification.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create certification' });
  }
});

router.patch('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = CertificationSchema.partial().parse(req.body);
    const certification = await Certification.findByIdAndUpdate(id, data, { new: true });
    if (!certification) {
      return res.status(404).json({ error: 'Certification not found' });
    }
    res.json(certification);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to update certification' });
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const certification = await Certification.findByIdAndDelete(id);
    if (!certification) {
      return res.status(404).json({ error: 'Certification not found' });
    }
    res.json({ message: 'Certification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete certification' });
  }
});

export default router;
