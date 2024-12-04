import ContactMessage from '../models/contactMessage.model.js';
import { errorHandler } from '../utils/error.js';

export const createContactMessage = async (req, res, next) => {
    try {
        const { subject, email, message } = req.body;
        if (!subject || !email || !message) {
            return next(errorHandler(400, 'All fields are required'));
        }
        const newContactMessage = new ContactMessage({
            subject,
            email,
            message,
        });
        await newContactMessage.save();
        res.status(201).json(newContactMessage);
    } catch (error) {
        next(error);
    }
}