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

export const commentRouter: Router = router;