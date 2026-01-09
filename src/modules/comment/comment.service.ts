import {prisma} from "../../lib/prisma";


const createComment = async (payload:{
    content: string;
    authorId: string;
    postId: string;
    parentCommentId?: string;

}) => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    })

    if (payload.parentCommentId) {
        await prisma.comment.findUniqueOrThrow({
            where: {
                id: payload.parentCommentId
            }
        })
    }
    return await prisma.comment.create({
        data: payload
    })
}

export  const  commentService = {
    createComment
};