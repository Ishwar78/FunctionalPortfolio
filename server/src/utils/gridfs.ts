import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import { Readable } from 'stream';

let gridFSBucket: GridFSBucket | null = null;

export const initializeGridFS = (db: mongoose.Connection) => {
  gridFSBucket = new GridFSBucket(db.getClient().db(db.getName()));
};

export const uploadFile = async (
  filename: string,
  buffer: Buffer,
  metadata?: Record<string, any>
): Promise<mongoose.Types.ObjectId> => {
  if (!gridFSBucket) {
    throw new Error('GridFS not initialized');
  }

  return new Promise((resolve, reject) => {
    const readStream = Readable.from(buffer);
    const uploadStream = gridFSBucket!.openUploadStream(filename, {
      metadata: metadata || {},
    });

    readStream.pipe(uploadStream);

    uploadStream.on('finish', (file) => {
      resolve(file._id as mongoose.Types.ObjectId);
    });

    uploadStream.on('error', (error) => {
      reject(error);
    });
  });
};

export const deleteFile = async (fileId: mongoose.Types.ObjectId): Promise<void> => {
  if (!gridFSBucket) {
    throw new Error('GridFS not initialized');
  }

  return new Promise((resolve, reject) => {
    gridFSBucket!.delete(fileId, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

export const downloadFile = async (fileId: mongoose.Types.ObjectId): Promise<Buffer> => {
  if (!gridFSBucket) {
    throw new Error('GridFS not initialized');
  }

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const downloadStream = gridFSBucket!.openDownloadStream(fileId);

    downloadStream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    downloadStream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    downloadStream.on('error', (error) => {
      reject(error);
    });
  });
};

export const getFileUrl = (fileId: mongoose.Types.ObjectId): string => {
  return `/api/files/${fileId}`;
};
