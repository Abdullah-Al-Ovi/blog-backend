import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  seen: {
    type: Boolean,
    default: false
  }
},
{ timestamps: true }
);

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;