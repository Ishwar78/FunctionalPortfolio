import mongoose, { Schema, Document } from 'mongoose';

export interface ExperienceItem {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  location: string;
  details?: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface IResume extends Document {
  fullName: string;
  title: string;
  email: string;
  phone?: string;
  location: string;
  profileImage?: string;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema({
  position: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: [String],
});

const EducationSchema = new Schema({
  degree: {
    type: String,
    required: true,
  },
  institution: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  details: String,
});

const SkillCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  skills: [String],
});

const ResumeSchema = new Schema<IResume>(
  {
    fullName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: String,
    location: {
      type: String,
      required: true,
    },
    profileImage: String,
    summary: {
      type: String,
      required: true,
    },
    experience: [ExperienceSchema],
    education: [EducationSchema],
    skills: [SkillCategorySchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Resume = mongoose.model<IResume>('Resume', ResumeSchema);
