import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: "us-east-1" });

export const uploadFileToS3 = async (file: File, bucketName: string, key: string) => {
const command = new PutObjectCommand({
  Bucket: bucketName,
  Key: key,
  Body: JSON.stringify({}),
  ContentType: "application/json",
    });

    await s3Client.send(command);
};