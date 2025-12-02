import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminUser extends Document {
  email: string;
  passwordHash: string;
  role: 'owner' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'admin'],
      default: 'owner',
    },
  },
  { timestamps: true }
);

export const AdminUser = mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);
