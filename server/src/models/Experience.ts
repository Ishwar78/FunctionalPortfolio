import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience extends Document {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  location: string;
  description: string[];
  technologies: string[];
  companyLogo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
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
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      required: true,
    },
    description: [String],
    technologies: [String],
    companyLogo: String,
  },
  { timestamps: true }
);

export const Experience = mongoose.model<IExperience>('Experience', ExperienceSchema);
