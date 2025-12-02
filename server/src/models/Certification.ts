import mongoose, { Schema, Document } from 'mongoose';

export interface ICertification extends Document {
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  certificateImage?: string;
  description?: string;
  skills?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CertificationSchema = new Schema<ICertification>(
  {
    title: {
      type: String,
      required: true,
    },
    issuer: {
      type: String,
      required: true,
    },
    issueDate: {
      type: String,
      required: true,
    },
    expiryDate: String,
    credentialId: String,
    credentialUrl: String,
    certificateImage: String,
    description: String,
    skills: [String],
  },
  { timestamps: true }
);

CertificationSchema.index({ issuer: 1, issueDate: -1 });

export const Certification = mongoose.model<ICertification>('Certification', CertificationSchema);
