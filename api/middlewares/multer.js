import multer from 'multer';
import path from 'path';
import { ACCEPTED_IMAGE_TYPES } from '../constants.js';

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname),
      );
    },
  });

  const imageFilter = function (req, file, cb) {
    if (ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true); // Accept image
    } else {
      // Reject image (skip upload)
      cb(new Error('Unsupported image type'), false);
    }
  };

  export const imageUpload = multer({
    storage: imageStorage,
    fileFilter: imageFilter,
  });