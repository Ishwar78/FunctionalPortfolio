import { Router, Request, Response } from 'express';
import { Project } from '../models/Project';
import { ProjectSchema } from '../validation/schemas';
import { generateSlug, ensureUniqueSlug } from '../utils/slug';
import { authMiddleware } from '../middleware/auth';
import { ZodError } from 'zod';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({})
      .sort({ display_order: 1, createdAt: -1 })
      .lean();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.get('/:idOrSlug', async (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params;

    let project = null;

    // Agar 24-char hex hai, pehle _id se try karo
    if (/^[0-9a-fA-F]{24}$/.test(idOrSlug)) {
      project = await Project.findById(idOrSlug).lean();
    }

    // Agar id se nahi mila (ya id nahi thi) to slug se try karo
    if (!project) {
      project = await Project.findOne({ slug: idOrSlug }).lean();
    }

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});


router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = ProjectSchema.parse(req.body);

    let slug = data.slug || generateSlug(data.title);
    slug = await ensureUniqueSlug(slug, async (s) => {
      const existing = await Project.findOne({ slug: s });
      return !!existing;
    });

    const project = new Project({
      ...data,
      slug,
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = ProjectSchema.parse(req.body);

    let slug = data.slug || generateSlug(data.title);
    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (slug !== existingProject.slug) {
      slug = await ensureUniqueSlug(slug, async (s) => {
        const existing = await Project.findOne({
          slug: s,
          _id: { $ne: req.params.id },
        });
        return !!existing;
      });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...data, slug },
      { new: true, runValidators: true }
    );

    res.json(project);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    res.status(500).json({ error: 'Failed to update project' });
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
