import express from 'express';
import multer from 'multer';
import { getAllChapters, getChapterById, uploadChapters } from '../controllers/chapterController.js';
import { adminAuth } from '../middleware/adminAuth.js';
import limiter from '../middleware/rateLimiter.js';


const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/chapters', limiter,getAllChapters);
router.get('/chapters/:id', limiter,getChapterById);
router.post('/chapters', adminAuth, upload.single('file'), uploadChapters);

export default router;
