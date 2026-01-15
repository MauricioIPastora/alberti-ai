import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sanitize email for use as S3 folder name
 * Must match the Lambda function's sanitization logic exactly
 */
export function sanitizeEmail(email: string): string {
  return email
    .toLowerCase()
    .replace("@", "_at_")
    .replace(/[^a-z0-9._-]/g, "_");
}
