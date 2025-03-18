import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    senderRole: { type: String, enum: ['admin', 'user', 'rescuer', 'doctor'], required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiverRole: { type: String, enum: ['admin', 'user', 'rescuer', 'doctor'], required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    chatType: { type: String, default: 'private' }
  });
  
export const Chat = mongoose.model('Chat', ChatSchema);