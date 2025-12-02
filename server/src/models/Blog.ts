import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  viewCount: number;
}

const BlogSchema = new Schema<IBlog>(
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
    excerpt: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    featuredImage: String,
    author: {
      type: String,
      default: 'Admin',
    },
    category: {
      type: String,
      required: true,
    },
    tags: [String],
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

BlogSchema.index({ slug: 1 });
BlogSchema.index({ isPublished: 1, publishedAt: -1 });
BlogSchema.index({ category: 1 });

export const Blog = mongoose.model<IBlog>('Blog', BlogSchema);
