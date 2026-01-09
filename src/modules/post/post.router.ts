import express, {Router} from 'express';
import {postController} from "./post.controller";

const router = express.Router();

router.get(
    '/',
    postController.getAllPost
)

router.get('/:postId', postController.getPostById)

router.post('/', postController.createPost)


export const postRouter: Router = router;