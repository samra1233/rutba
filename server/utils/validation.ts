/**
 * Shared server-side validation helpers.
 * All user-supplied data passes through here before touching the database.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length <= 254 && EMAIL_RE.test(value.trim());
}

export function isNonEmptyString(value: unknown, maxLength = 500): boolean {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength;
}

export function isValidPhone(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

export function isPositiveNumber(value: unknown): boolean {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

export function isNonNegativeInteger(value: unknown): boolean {
  return Number.isInteger(value) && (value as number) >= 0;
}

export function isPositiveInteger(value: unknown): boolean {
  return Number.isInteger(value) && (value as number) > 0;
}

export function sanitizeString(value: unknown, maxLength = 500): string {
  if (typeof value !== 'string') return '';
  const cleaned = value.replace(/[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]/g, '').replace(/\\s+/g, ' ').trim();
  return cleaned.slice(0,maxLength);
}

export function toBoolean(value: unknown): boolean {
  return value === true || value === 'true' || value === '1' || value === 1;
}
export function validateOrderPayload(body: any): string[] {
  const errors: string[] = [];
  const sd = body?.shippingDetails;
  if (!sd) errors.push('Shipping details are required.');
  if (typeof body?.userId !== 'string' || !body.userId.trim()) errors.push('User ID is required.');
  if (!Array.isArray(body?.items) || body.items.length === 0) errors.push('Order must contain at least one item.');
  return errors;
}
