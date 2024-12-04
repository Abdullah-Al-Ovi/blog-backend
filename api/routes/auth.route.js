import express from "express";
import { google, signin, signup } from "../controllers/auth.controller.js";
import { imageUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post('/signup', imageUpload.single('profileImage'),signup);
router.post('/signin', signin);
router.post('/google', google);

export default router;