import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:3000',
];

// Add environment-specific origins
if (process.env.CORS_ORIGIN) {
  allowedOrigins.push(process.env.CORS_ORIGIN);
}

// Configure CORS - be permissive since this is a single-server setup serving both frontend and API
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? true  // Allow all origins in production (single server setup)
    : (origin, callback) => {
      // In development, check against whitelist
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Log but still allow in development for debugging
        console.warn(`CORS: Allowing request from ${origin}`);
        callback(null, true);
      }
    },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(morgan('dev'));
app.use(express.json());
// ---- CORS CONFIG YAHAN TAK ----

connectDB().catch(() => {
  console.error('Failed to connect to database');
  process.exit(1);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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

// Serve static files from the frontend dist folder in production
const frontendDistPath = path.join(__dirname, '../../dist');
app.use(express.static(frontendDistPath, {
  maxAge: '1d',
  etag: false,
}));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
