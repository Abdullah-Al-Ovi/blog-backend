import express from 'express';
const router = express.Router();
import { createContactMessage } from '../controllers/contactMessage.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

router.post('/createContactMessage',verifyToken, createContactMessage);

export default router;