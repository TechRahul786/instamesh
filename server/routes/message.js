import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";

import {
    sendMessage,
    getMessages,
    getConversations,
    markMessagesAsSeen
} from "../controllers/message.controller.js";

const router = express.Router();

router.get(
    "/conversations",
    isAuthenticated,
    getConversations
);

router.get(
    "/:id",
    isAuthenticated,
    getMessages
);

router.post(
    "/send/:id",
    isAuthenticated,
    sendMessage
);

router.put(
    "/seen/:id",
    isAuthenticated,
    markMessagesAsSeen
);

export default router;