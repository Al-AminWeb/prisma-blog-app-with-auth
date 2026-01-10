import {prisma} from "../../lib/prisma";

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

export const commentService = {
    createComment,
    getCommentById,
    getCommentsByAuthor
};