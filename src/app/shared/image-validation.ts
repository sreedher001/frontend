export const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
export const ALLOWED_IMAGE_ACCEPT = '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp';

export function isAllowedImageFile(file: File): boolean {
  if (ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) return true;
  const name = file.name.toLowerCase();
  return ALLOWED_IMAGE_EXTENSIONS.some(ext => name.endsWith(ext));
}
