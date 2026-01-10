import {Request, Response} from "express";
import {commentService} from "./comment.service";

const createComment = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        req.body.authorId = user?.id;
        const result = await commentService.createComment(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error('Create comment error:', error); // 👈 THIS
        res.status(500).json({message: "Internal Server Error"});
    }
};

const getCommentsById = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params
        const result = await commentService.getCommentById(commentId as string)
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Comment fetched failed",
            details: e
        })
    }
};








// const getAllPost = async (req: Request, res: Response) => {
//     try {
//         const {search} = req.query;
//         console.log('Search query:', search);
//         const searchString = typeof search === 'string' ? search : undefined
//         const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
//
//         const isFeatured = req.query.isFeatured
//             ? req.query.isFeatured === 'true'
//                 ? true
//                 : req.query.isFeatured === 'false'
//                     ? false
//                     : undefined
//             : undefined
//
//
//         const status = req.query.status as PostStatus | undefined
//
//         const authorId = req.query.authorId as string | undefined
//
//         const {page, limit, skip, sortBy, sortOrder} = paginationSortingHelper(req.query)
//
//
//         const result = await postService.getAllPost({
//             search: searchString,
//             tags,
//             isFeatured,
//             status,
//             authorId,
//             page,
//             limit,
//             skip,
//             sortBy,
//             sortOrder
//         });
//         res.status(200).json(result);
//     } catch (error) {
//         res.status(400).json({message: "Internal Server Error"})
//     }
// }
//
// const getPostById = async (req: Request, res: Response) => {
//     try {
//         const { postId } = req.params;
//         if (!postId) {
//             throw new Error("Post Id is required!")
//         }
//         const result = await postService.getPostById(postId);
//         res.status(200).json(result)
//     } catch (e) {
//         res.status(400).json({
//             error: "Post creation failed",
//             details: e
//         })
//     }
// }

export const commentController = {
   createComment,
    getCommentsById,
}