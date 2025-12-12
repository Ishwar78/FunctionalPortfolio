import { Router, Request, Response } from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { uploadFile, deleteFile, downloadFile } from '../utils/gridfs';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload file
router.post('/upload', authMiddleware, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const fileId = await uploadFile(req.file.originalname, req.file.buffer, {
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
    });

    res.json({
      fileId,
      filename: req.file.originalname,
      url: `/api/files/${fileId}`,
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Download file
router.get('/:fileId', async (req: Request, res: Response) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    const buffer = await downloadFile(fileId);

    res.set('Content-Type', 'application/octet-stream');
    res.set('Cache-Control', 'public, max-age=31536000');
    res.send(buffer);
  } catch (error) {
    console.error('File download error:', error);
    res.status(404).json({ error: 'File not found' });
  }
});

// Delete file
router.delete('/:fileId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    await deleteFile(fileId);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;
