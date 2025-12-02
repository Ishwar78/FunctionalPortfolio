import { Router, Request, Response } from 'express';
import { AdminUser } from '../models/AdminUser';
import { LoginSchema } from '../validation/schemas';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { ZodError } from 'zod';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    const admin = await AdminUser.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await verifyPassword(password, admin.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({
      userId: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    });

    res.json({
      token,
      user: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
