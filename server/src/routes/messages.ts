import { Router, Request, Response } from 'express';
import { Message } from '../models/Message';
import { MessageSchema } from '../validation/schemas';
import { authMiddleware } from '../middleware/auth';
import { contactLimiter } from '../middleware/rateLimiter';
import { sendWhatsAppMessage } from '../services/whatsapp';
import { ZodError } from 'zod';

const router = Router();

router.post('/', contactLimiter, async (req: Request, res: Response) => {
  try {
    const data = MessageSchema.parse(req.body);

    const message = new Message(data);
    await message.save();

    const toNumber = process.env.WHATSAPP_TO_NUMBER || '';
    if (toNumber) {
      sendWhatsAppMessage(toNumber, data.name, data.email, data.subject, data.message).catch(
        (error) => {
          console.error('Failed to send WhatsApp notification:', error);
        }
      );
    }

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    res.status(500).json({ error: 'Failed to send message' });
  }
});

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({})
      .sort({ createdAt: -1 })
      .lean();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
