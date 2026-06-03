import express from "express"
import { editProfile, followOrUnfollow, getProfile, getSuggestedUser, login, logout, register } from "../controllers/users.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import upload from "../middlewares/upload.js"

const router = express.Router()

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get(
    "/profile/:id",
    isAuthenticated,
    getProfile
);

router.put(
    "/profile",
    isAuthenticated,
    upload.single("profilepic"),
    editProfile
);

router.get(
    "/suggested-users",
    isAuthenticated,
    getSuggestedUser
);

router.post(
    "/:id/follow",
    isAuthenticated,
    followOrUnfollow
);

export default router