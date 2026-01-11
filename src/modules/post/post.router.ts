import express, {Router} from 'express';
import {postController} from "./post.controller";
import auth, {UserRole} from "../../middlewares/auth";


const router = express.Router();

router.get(
    '/my-posts',
    auth(UserRole.USER, UserRole.ADMIN),
    postController.getMyPost
)

router.get(
    '/',
    postController.getAllPost
)

router.get(
    '/:postId',
    postController.getPostById
)

router.get(
    "/stats",
    auth(UserRole.ADMIN),
    postController.getStats
)

router.post(
    '/',
    auth(UserRole.USER, UserRole.ADMIN),
    postController.createPost
)

router.patch("/:postId",auth(UserRole.USER,UserRole.ADMIN),postController.updatePost)

router.delete(
    "/:postId",
    auth(UserRole.USER, UserRole.ADMIN),
    postController.deletePost
)
export const postRouter: Router = router;