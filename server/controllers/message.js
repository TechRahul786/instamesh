import { Conversation } from "../models/conversation.js";
import { Message } from "../models/message.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        if (!message?.trim()) {
            return res.status(400).json({
                message: "Message is required",
                success: false
            });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = await Message.create({
            conversationId: conversation._id,
            senderId,
            receiverId,
            message: message.trim()
        });

        conversation.lastMessage = newMessage._id;
        await conversation.save();

        return res.status(201).json({
            message: "Message sent successfully",
            data: newMessage,
            success: true
        });

    } catch (error) {
        console.error("Send Message Error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            return res.status(200).json({
                messages: [],
                success: true
            });
        }

        const messages = await Message.find({
            conversationId: conversation._id
        }).sort({ createdAt: 1 });

        return res.status(200).json({
            messages,
            success: true
        });

    } catch (error) {
        console.error("Get Messages Error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getConversations = async (req, res) => {
    try {
        const userId = req.id;

        const conversations = await Conversation.find({
            participants: userId
        })
        .populate({
            path: "participants",
            select: "username profilepic"
        })
        .populate({
            path: "lastMessage"
        })
        .sort({ updatedAt: -1 });

        return res.status(200).json({
            conversations,
            success: true
        });

    } catch (error) {
        console.error("Get Conversations Error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const markMessagesAsSeen = async (req, res) => {
    try {
        const currentUserId = req.id;
        const senderId = req.params.id;

        await Message.updateMany(
            {
                senderId,
                receiverId: currentUserId,
                isSeen: false
            },
            {
                $set: { isSeen: true }
            }
        );

        return res.status(200).json({
            message: "Messages marked as seen",
            success: true
        });

    } catch (error) {
        console.error("Seen Message Error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};