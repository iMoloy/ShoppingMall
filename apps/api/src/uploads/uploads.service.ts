import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
  constructor(private readonly configService: ConfigService) {}

  async uploadImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    // MIME type check
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
      );
    }

    // Size limit check (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size must not exceed 5MB');
    }

    const apiKey = this.configService.get<string>('IMGBB_API_KEY');

    // If IMGBB API key is provided, relay upload to ImgBB CDN
    if (apiKey) {
      try {
        const formData = new FormData();
        const blob = new Blob([new Uint8Array(file.buffer)], {
          type: file.mimetype,
        });
        formData.append('image', blob, file.originalname);

        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: 'POST',
          body: formData,
        });

        const data = (await res.json()) as any;
        if (!data.success) {
          throw new Error(data.error?.message || 'ImgBB upload failed');
        }

        return {
          url: data.data.url,
          displayUrl: data.data.display_url,
          deleteUrl: data.data.delete_url,
        };
      } catch (err: any) {
        throw new InternalServerErrorException(
          `Image upload to CDN failed: ${err.message}`,
        );
      }
    }

    // Fallback if no external CDN key configured: return base64 data URI for dev convenience
    const base64 = file.buffer.toString('base64');
    const dataUri = `data:${file.mimetype};base64,${base64}`;

    return {
      url: dataUri,
      note: 'Processed via dev memory buffer (configure IMGBB_API_KEY for permanent CDN storage)',
    };
  }
}
