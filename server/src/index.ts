import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import contentRoutes from './routes/content';
import messageRoutes from './routes/messages';
import resumeRoutes from './routes/resumes';
import experienceRoutes from './routes/experience';
import certificationRoutes from './routes/certifications';
import blogRoutes from './routes/blogs';

const app = express();
const PORT = process.env.PORT || 5000;

// ---- CORS CONFIG YAHAN SE ----
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
];

if (process.env.CORS_ORIGIN) {
  allowedOrigins.push(process.env.CORS_ORIGIN);
}

app.use(morgan('dev'));
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
// ---- CORS CONFIG YAHAN TAK ----

connectDB().catch(() => {
  console.error('Failed to connect to database');
  process.exit(1);
});

app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/projects', projectRoutes);
app.use('/api/admin/content', contentRoutes);
app.use('/api/admin/messages', messageRoutes);
app.use('/api/admin/resumes', resumeRoutes);
app.use('/api/admin/experience', experienceRoutes);
app.use('/api/admin/certifications', certificationRoutes);
app.use('/api/admin/blogs', blogRoutes);

app.use('/api/projects', projectRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/contact', messageRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/blogs', blogRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
