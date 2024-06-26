import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';
import { dateConvert } from "../config/date-convert/index.js";
import * as stream from 'stream';

cloudinary.config({
  cloud_name: 'dlwy6u0kw',
  api_key: '666388981477497',
  api_secret: process.env.API_SECRET,
});

class CloudinaryService {
  async sendFile(file) {
    try {
      const currentModulePath = fileURLToPath(import.meta.url);
      const currentModuleDirectory = dirname(currentModulePath);
      const tempDirectory = path.join(currentModuleDirectory, 'temp');
      const tempFilePath = path.join(tempDirectory, 'tempfile');
      await fs.mkdir(tempDirectory, { recursive: true });
      await fs.writeFile(tempFilePath, file.data);
      const fileName = dateConvert(new Date()) + Buffer.from(file.name, 'binary').toString('utf-8');
      const result = await cloudinary.uploader.upload(tempFilePath, {
        folder: 'bonus-system/reports',
        resource_type: 'raw',
        type: 'upload',
        public_id: fileName,
      });
      await fs.unlink(tempFilePath);
      const url = result.secure_url;
      return { url, fileName: file.name };
    } catch (e) {
      console.log(e);
    }
  }

  async sendImage (file) {
    try {
      const buffer = file.data;
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: 'avatars' }, (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        });

        const bufferStream = new stream.PassThrough();
        bufferStream.end(buffer);
        bufferStream.pipe(uploadStream);
      });
    } catch (error) {
      console.error(error);
      throw new Error('Ошибка при загрузке изображения в Cloudinary');
    }
  }
}

export default new CloudinaryService();
