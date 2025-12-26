import {Request, Response} from "express";

const createPost = async (req: Request, res: Response) => {
    res.send("Post")
    console.log({
        req, res
    })
}

export const postController = {
    createPost
}