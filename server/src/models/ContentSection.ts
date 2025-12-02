import mongoose, { Schema, Document } from 'mongoose';

export interface IContentSection extends Document {
  key: 'hero' | 'about' | 'skills' | 'banners' | 'contact' | 'social';
  content: Record<string, any>;
  updatedAt: Date;
}

const ContentSectionSchema = new Schema<IContentSection>(
  {
    key: {
      type: String,
      enum: ['hero', 'about', 'skills', 'banners', 'contact', 'social'],
      unique: true,
      required: true,
    },
    content: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

export const ContentSection = mongoose.model<IContentSection>(
  'ContentSection',
  ContentSectionSchema
);
