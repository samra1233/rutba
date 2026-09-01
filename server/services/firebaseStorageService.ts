import { randomUUID } from 'crypto';
import { getFirebaseStorage } from '../config/firebase';

const DATA_URL_PATTERN = /^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/;

export async function persistImageDataUrl(value: string, folder: 'products' | 'categories'): Promise<string> {
  if (!value.startsWith('data:')) return value;
  const match = value.match(DATA_URL_PATTERN);
  if (!match) throw new Error('Only JPG, PNG, WebP or GIF images are supported');

  const [, contentType, encoded] = match;
  const buffer = Buffer.from(encoded, 'base64');
  if (buffer.length > 5 * 1024 * 1024) throw new Error('Each image must be 5MB or smaller');

  const storage = getFirebaseStorage();
  if (!storage) throw new Error('Firebase Storage is not configured');

  const extension = contentType === 'image/jpeg' ? 'jpg' : contentType.split('/')[1];
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
