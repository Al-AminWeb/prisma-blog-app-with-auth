import express, {Router} from 'express';
import {commentController} from "./comment.controller";
import auth, {UserRole} from "../../middlewares/auth";


const router = express.Router();

router.post('/', auth(UserRole.ADMIN, UserRole.USER), commentController.createComment)

router.get('/:commentId', commentController.getCommentsById)

router.get(
    "/author/:authorId",
    commentController.getCommentsByAuthor
)

router.delete(
    "/:commentId",
    auth(UserRole.USER, UserRole.ADMIN),
    commentController.deleteComment
)

export const commentRouter: Router = router;