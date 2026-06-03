import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import upload from "../middlewares/upload.js"
import {
    addPost,
    getAllPost,
    getUserPost,
    likePost,
    dislikePost,
    addComment,
    getComments,
    deletePost,
    bookmarkPost
} from "../controllers/post.js";


const router = express.Router();

router.post(
    "/addpost",
    isAuthenticated,
    upload.single("image"),
    addPost
);

router.get(
    "/all",
    isAuthenticated,
    getAllPost
);

router.get(
    "/user/:id",
    isAuthenticated,
    getUserPost
);

router.delete(
    "/delete/:id",
    isAuthenticated,
    deletePost
);

router.put(
    "/:id/like",
    isAuthenticated,
    likePost
);

router.put(
    "/:id/dislike",
    isAuthenticated,
    dislikePost
);

router.post(
    "/:id/comment",
    isAuthenticated,
    addComment
);

router.get(
    "/:id/comments",
    isAuthenticated,
    getComments
);

router.put(
    "/:id/bookmark",
    isAuthenticated,
    bookmarkPost
);

export default router