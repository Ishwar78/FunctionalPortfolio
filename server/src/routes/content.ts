import { Router, Request, Response } from 'express';
import { ContentSection } from '../models/ContentSection';
import { ContentSectionSchema } from '../validation/schemas';
import { authMiddleware } from '../middleware/auth';
import { ZodError } from 'zod';

const router = Router();

router.get('/:key', async (req: Request, res: Response) => {
  try {
    const content = await ContentSection.findOne({ key: req.params.key }).lean();
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.json(content.content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

router.put(
  '/:key',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      // 🛠 important: body null/undefined ho to empty object bana do
      const rawBody =
        req.body && typeof req.body === 'object' ? req.body : {};

      const data = ContentSectionSchema.parse({
        key: req.params.key,
        content: rawBody,
      });

      const content = await ContentSection.findOneAndUpdate(
        { key: data.key },
        { content: data.content },
        { new: true, upsert: true, runValidators: true }
      );

      return res.json(content);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors,
        });
      }
      res.status(500).json({ error: 'Failed to update content' });
    }
  }
);

export default router;
