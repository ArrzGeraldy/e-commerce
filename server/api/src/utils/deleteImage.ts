import fs from "fs";
import path from "path";
import { logger } from "./logger";

export const deleteFileInImagesFolder = (fileName: string) => {
  const folderPath = path.resolve(process.cwd(), "images");
  const imagePath = path.join(folderPath, fileName);

  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return;
    }
    logger.info("File deleted successfully");
  });
};
