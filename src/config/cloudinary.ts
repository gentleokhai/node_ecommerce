import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import streamifier from 'streamifier';
import { Response } from 'express';
import { AppError } from '../utility/AppError';

dotenv.config();

interface UploadResult {
  url: string | undefined;
  id: string | undefined;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = (
  file: Buffer,
  folder: string,
  res: Response
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        format: 'jpg',
        folder: folder,
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading file to Cloudinary:', error);
          throw new AppError('Error uploading image', 400);
        }

        resolve({
          url: result?.secure_url,
          id: result?.public_id,
        });
      }
    );
    streamifier.createReadStream(file).pipe(uploadStream);
  });
};

export { upload };
