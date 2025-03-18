import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';
import s3 from "../config/s3.cofig";
import logger from "../config/logger.config";

dotenv.config();

export const getPresignedUrl = async (
    fileKey: string,
    expiresInSeconds = 600
  ): Promise<string | null> => {
    try {
      logger.info(`Generating presigned URL for file: ${fileKey}`);
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
      });
  
      const url = await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
  
      logger.info(`Presigned URL generated successfully for file: ${fileKey}`);
      return url;
    } catch (error) {
      logger.error(`Failed to generate presigned URL for file: ${fileKey}`, error);
      return null;
    }
  };

  export const getPresignedUploadUrl = async (
    folderName: string,
    fileName: string,
    fileType: string,
    expiresInSeconds = 300
  ): Promise<string | null> => {
    try {
      const fileKey = `${folderName}/${Date.now()}-${fileName}`;
      logger.info(`Generating upload URL for file: ${fileKey}`);
  
      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
        ContentType: fileType,
      });
  
      const url = await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
  
      logger.info(`Upload URL generated successfully for file: ${fileKey}`);
      return url;
    } catch (error) {
      logger.error(`Failed to generate upload URL for file: ${folderName}/${fileName}`, error);
      return null;
    }
  };