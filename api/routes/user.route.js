import express from "express";
import { deleteUser, getUser, getUsers, signout, test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { imageUpload } from "../middlewares/multer.js";

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken,imageUpload.single('profileImage'), updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getUsers);
router.get('/:userId', getUser);

export default router;