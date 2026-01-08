import {Request, Response} from "express";
import {postService} from "./post.service";

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

        const result = await postService.getAllPost({
            search: searchString,
            tags: []
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: "Internal Server Error"})
    }
}

export const postController = {
    createPost,
    getAllPost
}