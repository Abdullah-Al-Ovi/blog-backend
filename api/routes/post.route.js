import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletepost, getposts, getPostsByUserEmail, updatepost } from '../controllers/post.controller.js';
import { imageUpload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/create', verifyToken,imageUpload.single('image'), create)
router.get('/getposts', getposts)
router.get('/getPostsByUserEmail', getPostsByUserEmail);

router.delete('/deletepost/:postId/:userId', verifyToken, deletepost)
router.put('/updatepost/:postId/:userId', verifyToken,imageUpload.single('image'), updatepost)

export default router;