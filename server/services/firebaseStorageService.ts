import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { getFirebaseStorage } from '../config/firebase';

export async function persistImageDataUrl(value: string, folder: 'products' | 'categories'): Promise<string> {
  if (!value || typeof value !== 'string') return '';
  if (!value.startsWith('data:')) return value;

  const commaIndex = value.indexOf(',');
  if (commaIndex === -1) return value;

  const header = value.substring(0, commaIndex);
  const base64Data = value.substring(commaIndex + 1).replace(/\s/g, '');

  let contentType = 'image/png';
  let extension = 'png';

  const typeMatch = header.match(/^data:([^;]+)/);
  if (typeMatch && typeMatch[1]) {
    contentType = typeMatch[1].toLowerCase();
    if (contentType.includes('jpeg') || contentType.includes('jpg')) {
      extension = 'jpg';
      contentType = 'image/jpeg';
    } else if (contentType.includes('webp')) {
      extension = 'webp';
    } else if (contentType.includes('gif')) {
      extension = 'gif';
    } else if (contentType.includes('svg')) {
      extension = 'svg';
    }
  }

  const buffer = Buffer.from(base64Data, 'base64');
  if (buffer.length > 10 * 1024 * 1024) throw new Error('Each image must be 10MB or smaller');

  const storage = getFirebaseStorage();
  if (!storage) {
    // Firebase Storage unavailable (sandbox): persist image locally under uploads/
    // so admin uploads survive rebuilds and restarts without bloating the JSON database with base64.
    const uploadsDir = path.join(process.cwd(), 'uploads', folder);
    fs.mkdirSync(uploadsDir, { recursive: true });
    const filename = `${Date.now()}-${randomUUID()}.${extension}`;
    fs.writeFileSync(path.join(uploadsDir, filename), buffer);
    return `/uploads/${folder}/${filename}`;
  }

  const objectName = `${folder}/${Date.now()}-${randomUUID()}.${extension}`;
  const downloadToken = randomUUID();
  const bucket = storage.bucket();
  const file = bucket.file(objectName);
  await file.save(buffer, {
    resumable: false,
    contentType,
    metadata: {
      cacheControl: 'public,max-age=31536000,immutable',
      metadata: { firebaseStorageDownloadTokens: downloadToken }
    }
  });

  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(objectName)}?alt=media&token=${downloadToken}`;
}

export async function persistProductImages(images: unknown): Promise<string[] | undefined> {
  if (!Array.isArray(images)) return undefined;
  return Promise.all(images.slice(0, 4).map(image => persistImageDataUrl(String(image), 'products')));
}
