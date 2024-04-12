import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
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

const upload = (file: string, folder: string): Promise<UploadResult> => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      {
        folder: folder,
        resource_type: 'auto',
        use_filename: true,
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading file to Cloudinary:', error);
          return;
        }

        resolve({
          url: result?.url,
          id: result?.public_id,
        });
      }
    );
  });
};

export { upload };
