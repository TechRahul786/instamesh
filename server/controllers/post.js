import sharp from "sharp"
import { User } from "../models/users.js"
import { Post } from "../models/post.js"
import { Comment } from "../models/comment.js"
import cloudinary from "../utils/cloudinary.js"
import { populate } from "dotenv"


export const addPost = async (req, res) => {

    try {
        const { caption } = req.body
        const authorId = req.id
        const image = req.file
        let post_image;

        if (!image) {
            return res.status(400).json({
                message: "image required"
            })
        }

        const imageOptimize = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: "inside" })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        const fileUri = `data:${req.file.mimetype};base64,${imageOptimize.toString(
            "base64"
        )}`;

        const cloudResponse = await cloudinary.uploader.upload(fileUri, {
            folder: "image",
        });

        post_image = cloudResponse.secure_url;

        const post = await Post.create({
            caption,
            image: post_image,
            author: authorId
        })

        const user = await User.findById(authorId)
        if (user) {
            user.posts.push(post.id)
            await user.save()
        }

        await post.populate({ path: 'author', select: '-password' });
        return res.status(201).json({
            message: 'New post added',
            post,
            success: true,
        })
    } catch (error) {
        console.log(error)
    }

}

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: "author", select: "username profilepic" })
            .populate({
                path: "comments", sort: { createdAt: -1 }, populate: {
                    path: "author",
                    select: 'username profilePicture'
                }
            })

        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const getUserPost = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(401).json({
                message: "User not found",
                success: false
            })
        }

        const userPost = await Post.find({ author: userId }).sort({ createdAt: -1 })
            .populate({ path: 'author', select: "username , profilepic" })
            .populate({
                path: "comments", sort: { createdAt: -1 }, populate: {
                    path: "author",
                    select: 'username profilePicture'
                }
            })

        return res.status(200).json({
            post: userPost,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const likePost = async (req, res) => {

    try {
        const likedByUserId = req.id
        const postId = req.params.id
        const post = await Post.findById(postId)

        if (!post) {
            return res.status(401).json({
                message: "Post not found",
                success: false
            })
        }

        await post.updateOne({ $addToSet: { likes: likedByUserId } });
        await post.save();
        return res.status(200).json({
            message: "post liked",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const dislikePost = async (req, res) => {

    try {
        const likedByUserId = req.id
        const postId = req.params.id
        const post = await Post.findById(postId)

        if (!post) {
            return res.status(401).json({
                message: "Post not found",
                success: false
            })
        }

        await post.updateOne({ $pull: { likes: likedByUserId } });
        await post.save();
        return res.status(200).json({
            message: "post disliked",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const addComment = async (req, res) => {

    try {
        const postId = req.params.id
        const commenterId = req.id
        const { text } = req.body

        if (!text?.trim()) {
            return res.status(400).json({
                message: "Comment text is required",
                success: false,
            });
        }
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            });
        }

        const comment = await Comment.create({
            text: text.trim(),
            author: commenterId,
            post: postId
        }).populate({ path: 'author', select: "username profilepic" })

        post.comments.push({ comments: comment.id })
        await post.save()
        const populatedComment = await Comment.findById(comment._id)
            .populate({
                path: "author",
                select: "username profilepic",
            });

        return res.status(201).json({
            message: "Comment added successfully",
            comment: populatedComment,
            success: true,
        });
    } catch (error) {
        console.error("Add Comment Error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

export const getComments = async (req, res) => {
    try {
        const postId = req.params.id
        const comment = await Comment.find({ post: postId }).populate({ path: "author", select: "username profilepic" })
        if (!comment) {
            return res.status(400).json({
                messasge: "comments not found",
                success: false
            })
        }

        return res.status(200).json({
            comment: comment,
            success: true
        })

    } catch (error) {
        console.error("get Comment Error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

export const deletePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            });
        }

        if (post.author.toString() !== userId) {
            return res.status(403).json({
                message: "Unauthorized",
                success: false,
            });
        }

        await Promise.all([
            Post.findByIdAndDelete(postId),

            User.findByIdAndUpdate(userId, {
                $pull: { posts: postId },
            }),

            Comment.deleteMany({
                post: postId,
            }),
        ]);

        return res.status(200).json({
            message: "Post deleted successfully",
            success: true,
        });

    } catch (error) {
        console.error("Delete Post Error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

export const bookmarkPost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.id;

        const [post, user] = await Promise.all([
            Post.findById(postId),
            User.findById(userId).select("bookmarks")
        ]);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            });
        }

        const isBookmarked = user.bookmarks.some(
            bookmark => bookmark.toString() === postId
        );

        if (isBookmarked) {
            await User.findByIdAndUpdate(userId, {
                $pull: { bookmarks: postId }
            });

            return res.status(200).json({
                type: "unsaved",
                message: "Post removed from bookmarks",
                success: true,
            });
        }

        await User.findByIdAndUpdate(userId, {
            $addToSet: { bookmarks: postId }
        });

        return res.status(200).json({
            type: "saved",
            message: "Post bookmarked",
            success: true,
        });

    } catch (error) {
        console.error("Bookmark Post Error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

