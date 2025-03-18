import { Request, Response, Router } from "express";
import { getPresignedUploadUrl, getPresignedUrl } from "../utilities/s3.utils";
import logger from "../config/logger";

const s3Route = Router();

s3Route.get("/get-url", async (req: Request, res: Response) => {
  const { fileKey } = req.query;

  if (!fileKey) {
    logger.warn("File key is missing");
    return res.status(400).json({ error: "File key is required" });
  }

  try {
    logger.info(`Generating download URL for: ${fileKey}`);
    const url = await getPresignedUrl(fileKey as string);

    if (!url) {
      logger.error(`Failed to generate download URL for: ${fileKey}`);
      return res.status(500).json({ error: "Failed to generate URL" });
    }

    logger.info(`Download URL generated successfully for: ${fileKey}`);
    res.json({ url });
  } catch (error) {
    logger.error(`Error generating download URL for: ${fileKey}`, error);
    res.status(500).json({ error: "Failed to generate URL" });
  }
});

s3Route.get("/get-upload-url", async (req: Request, res: Response) => {
  const { folderName, fileName, fileType, expiresInSeconds } = req.query;

  if (!folderName || !fileName || !fileType) {
    logger.warn("Missing required fields for upload URL");
    return res.status(400).json({
      error: "Folder name, file name, and file type are required",
    });
  }

  try {
    const expires = expiresInSeconds ? parseInt(expiresInSeconds as string) : 300;

    logger.info(`Generating upload URL for ${folderName}/${fileName}`);
    const url = await getPresignedUploadUrl(
      folderName as string,
      fileName as string,
      fileType as string,
      expires
    );

    if (!url) {
      logger.error(`Failed to generate upload URL for ${folderName}/${fileName}`);
      return res.status(500).json({ error: "Failed to generate upload URL" });
    }

    logger.info(`Upload URL generated successfully for ${folderName}/${fileName}`);
    res.json({ url });
  } catch (error) {
    logger.error(`Error generating upload URL for ${folderName}/${fileName}`, error);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

export default s3Route;
