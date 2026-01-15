/* =============================================================================
   ALBERTI AI - S3 SERVICE
   Server-side S3 operations for file uploads
   ============================================================================= */

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;

/**
 * Upload a resume file to S3
 * @param fileBuffer - The file contents as a Buffer
 * @param s3Key - The full S3 key (path) for the file
 * @param contentType - The MIME type of the file
 */
export async function uploadResumeToS3(
  fileBuffer: Buffer,
  s3Key: string,
  contentType: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await s3Client.send(command);
    return { success: true };
  } catch (error: any) {
    console.error("S3 Upload Error:", error);
    return { success: false, error: error.message || "Failed to upload to S3" };
  }
}

/**
 * Delete a resume file from S3
 * @param s3Key - The full S3 key (path) of the file to delete
 */
export async function deleteResumeFromS3(
  s3Key: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });

    await s3Client.send(command);
    return { success: true };
  } catch (error: any) {
    console.error("S3 Delete Error:", error);
    return { success: false, error: error.message || "Failed to delete from S3" };
  }
}

/**
 * Generate a presigned URL to download a resume from S3
 * @param s3Key - The full S3 key (path) of the file
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 */
export async function getResumePresignedUrl(
  s3Key: string,
  expiresIn: number = 3600
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return { success: true, url };
  } catch (error: any) {
    console.error("S3 Presigned URL Error:", error);
    return { success: false, error: error.message || "Failed to generate download URL" };
  }
}
