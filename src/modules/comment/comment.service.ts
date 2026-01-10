import {prisma} from "../../lib/prisma";
import {CommentStatus} from "../../../generated/prisma/enums";

const getCommentById = async (id: string) => {
    return await prisma.comment.findUnique({
        where: {
            id
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    viewCount: true
                }
            }
        }
    })
}


const getCommentsByAuthor = async (authorId: string) => {
    return await prisma.comment.findMany({
        where: {
            authorId
        },
        orderBy: {createdAt: "desc"},
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
}


// 1. nijar comment delete korta parbe
// login thakte hobe
// tar nijar comment kina ata check korta hobe
const deleteComment = async (commentId: string, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    })

    if (!commentData) {
        throw new Error("Your provided input is invalid!")
    }

    return await prisma.comment.delete({
        where: {
            id: commentData.id
        }
    })
}


const createComment = async (payload: {
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

const updateComment = async (commentId: string, data: { content?: string, status?: CommentStatus }, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    })

    if (!commentData) {
        throw new Error("Your provided input is invalid!")
    }

    return await prisma.comment.update({
        where: {
            id: commentId,
            authorId
        },
        data
    })
}

export const commentService = {
    createComment,
    getCommentById,
    getCommentsByAuthor,
    deleteComment,
    updateComment
};