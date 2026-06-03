import { User } from "../models/users.js";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "Try different email",
                success: false,
            });
        };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json(
                {
                    message: "Invalid email format",
                    success: false
                }
            )
        }
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
                success: false,
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

export const login = async (req, res) => {

    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            });
        }

        const isPasawordMatch = await bcrypt.compare(password, user.password);

        if (!isPasawordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilepic: user.profilepic,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: user.posts
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            userData
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }


}

export const logout = async (_, res) => {
    try {
        res.cookie('tokken', "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id
        const user = User.findById({ userId }).populate({ path: 'posts', createdAt: -1 }).populate(bookmarks);
        return status(200).json({
            user,
            success: true
        })

    } catch (error) {
        console.log(error)
    }


}


export const editProfile = async (req, res) => {
    try {
        const userId = req.id;

        const { bio, gender } = req.body;

        const updatedata = {
            bio,
            gender,
        };

        if (req.file) {
            const fileUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
                "base64"
            )}`;

            const cloudResponse = await cloudinary.uploader.upload(fileUri, {
                folder: "profile_pics",
            });

            updatedata.profilepic = cloudResponse.secure_url;
        }

        const user = await User.findByIdAndUpdate(
            userId,
            updatedata,
            { new: true }
        );

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const getSuggestedUser = async (req, res) => {
    try {
        const user = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!user) {
            return res.status(401).json({
                message: "Currently do not have any user",
            })
        }
        return res.status(200).json({
            user: user,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const followOrUnfollow = async (req , res) =>{
    try {
        const currentUserId = req.id
        const targetedUserId = req.params.id

        if(currentUserId === targetedUserId){
            return res.status(400).json({
                message:"You cannot follow/unfollow yourself",
                success:false
            })
        }

        const currentUser = await User.findById({id:currentUserId});
        const targetedUser = await User.findById({id:targetedUserId});

        if(!currentUser || !targetedUser){
             return res.status(400).json({
                message:"User not Found",
                success:false
            })
        }

        const isFollowing = currentUser.followings.includes(targetedUserId)
        if(isFollowing){
            await Promise.all([
                User.updateOne({id:currentUserId},{$pull:{followings:targetedUserId}}),
                User.updateOne({id:targetedUserId},{$pull:{followers:currentUserId}})
            ])

            return res.status(200).json({
                message: "Unfollowed successfully",
                success: true
            });
        }else{
            await Promise.all([
                User.updateOne({id:currentUserId},{$push:{followings:targetedUserId}}),
                User.updateOne({id:targetedUserId},{$push:{followers:currentUserId}})
            ])

            return res.status(200).json({
                message: "Followed successfully",
                success: true
            });
        }


    } catch (error) {
        console.log(error)
    }
}