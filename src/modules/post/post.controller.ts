import {Request, Response} from "express";
import {postService} from "./post.service";
import {PostStatus} from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import {error} from "better-auth/api";
import {UserRole} from "../../middlewares/auth";

const createPost = async (req: Request, res: Response) => {
    try {
        console.log('Incoming body:', req.body); // 👈 debug
        const result = await postService.createPost(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error('Create post error:', error); // 👈 THIS
        res.status(500).json({message: "Internal Server Error"});
    }
};

const getAllPost = async (req: Request, res: Response) => {
    try {
        const {search} = req.query;
        console.log('Search query:', search);
        const searchString = typeof search === 'string' ? search : undefined
        const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

        const isFeatured = req.query.isFeatured
            ? req.query.isFeatured === 'true'
                ? true
                : req.query.isFeatured === 'false'
                    ? false
                    : undefined
            : undefined


        const status = req.query.status as PostStatus | undefined

        const authorId = req.query.authorId as string | undefined

        const {page, limit, skip, sortBy, sortOrder} = paginationSortingHelper(req.query)


        const result = await postService.getAllPost({
            search: searchString,
            tags,
            isFeatured,
            status,
            authorId,
            page,
            limit,
            skip,
            sortBy,
            sortOrder
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: "Internal Server Error"})
    }
}

const getPostById = async (req: Request, res: Response) => {
    try {
        const {postId} = req.params;
        if (!postId) {
            throw new Error("Post Id is required!")
        }
        const result = await postService.getPostById(postId);
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Post creation failed",
            details: e
        })
    }
}

const updatePost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are unauthorized!")
        }

        const { postId } = req.params;
        const isAdmin = user.role === UserRole.ADMIN
        const result = await postService.updatePost(postId as string, req.body, user.id, isAdmin);
        res.status(200).json(result)
    } catch (e) {
        const errorMessage = (e instanceof Error) ? e.message : "Post update failed!"
        res.status(400).json({
            error: errorMessage,
            details: e
        })
    }
}

const getMyPost = async (req: Request, res: Response) => {
    try {

        const user = req.user;
        console.log(user)
        if (!user) {
            throw new Error("User not found!")
        }
        console.log(user)
        const result = await postService.getMyPost(user.id);
        res.status(200).json(result)
    } catch (e) {
        console.log(e)
        res.status(400).json({
            error: "Post fetching failed",
            details: e
        })
    }
}

const deletePost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are unauthorized!")
        }

        const { postId } = req.params;
        const isAdmin = user.role === UserRole.ADMIN
        const result = await postService.deletePost(postId as string, user.id, isAdmin);
        res.status(200).json(result)
    } catch (e) {
        const errorMessage = (e instanceof Error) ? e.message : "Post delete failed!"
        res.status(400).json({
            error: errorMessage,
            details: e
        })
    }
}
export const postController = {
    createPost,
    getAllPost,
    getPostById,
    getMyPost,
    updatePost,
    deletePost
}