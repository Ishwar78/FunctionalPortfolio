import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  short_description: string;
  detailed_description?: string;
  tech_stack: string[];
  category: string;
  cover_image_url?: string;
  github_url?: string;
  live_url?: string;
  is_featured: boolean;
  display_order: number;
  readme_content?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    short_description: {
      type: String,
      required: true,
    },
    detailed_description: String,
    tech_stack: [String],
    category: String,
    cover_image_url: String,
    github_url: String,
    live_url: String,
    is_featured: {
      type: Boolean,
      default: false,
    },
    display_order: {
      type: Number,
      default: 0,
    },
    readme_content: String,
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
