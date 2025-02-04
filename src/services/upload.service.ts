import multerS3 from 'multer-s3';
import multer from 'multer';
import path from 'path';
import s3Client from '../config/s3.cofig';


const createUploadService = (folder: string) => {
  return multer({
    storage: multerS3({
      s3: s3Client,
      bucket: process.env.S3_BUCKET_NAME || '',
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        const fileName = `${folder}/${Date.now()}-${file.originalname}`;
        cb(null, fileName);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file) {
        console.log("File not provided in request");
        return cb(null, false);
      }
    
      // Allowed file extensions
      const allowedFileTypes = /jpeg|jpg|png|pdf|doc|docx/;
      const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedFileTypes.test(file.mimetype);
    
      if (!extname) {
        console.log(`File rejected: Invalid extension (${file.originalname})`);
        return cb(null, false);
      }
    
      if (!mimetype) {
        console.log(`File rejected: Invalid MIME type (${file.mimetype})`);
        return cb(null, false);
      }
    
      console.log(`File accepted: ${file.originalname}`);
      cb(null, true);
    },
    
    limits: {
      fileSize: 5 * 1024 * 1024 
    }
  });
};

export default createUploadService;






