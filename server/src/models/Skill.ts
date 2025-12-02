import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
  icon?: string;
  description?: string;
  projects?: string[];
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Frontend', 'Backend', 'DevOps', 'Database', 'Tools', 'Other'],
    },
    proficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate',
    },
    yearsOfExperience: Number,
    icon: String,
    description: String,
    projects: [String],
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

SkillSchema.index({ category: 1, displayOrder: 1 });

export const Skill = mongoose.model<ISkill>('Skill', SkillSchema);
