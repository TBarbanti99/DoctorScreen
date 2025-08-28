import { diskStorage } from 'multer';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const filename = `${Date.now()}-${file.originalname?.split(' ').join('-')}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    // Add file validation
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf|DICOM)$/)) {
      return cb(new Error('Invalid file type'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 3064, 
  },
};
