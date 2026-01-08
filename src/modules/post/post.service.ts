import {prisma} from "../../lib/prisma";
import {Post} from "../../../generated/prisma/client";


const createPost = async (data: Omit<Post, "id" | "createdAt" | "updatedAt">) => {
    const result = await prisma.post.create({
        data
    })
    return result;
}

const getAllPost = async (payload: {
    search: string | undefined,
    tags: string[] | [],
}) => {
    const result = await prisma.post.findMany({
        where: {
            AND: [
                {
                    OR: [
                        {
                            title: {
                                contains: payload.search as string,
                                mode: 'insensitive'

                            },
                        },
                        {
                            content: {
                                contains: payload.search as string,
                                mode: "insensitive"
                            }
                        },
                        {
                            tags: {
                                has: payload.search as string
                            }

                        }


                    ]
                },
                {
                    tags: {
                        hasEvery: payload.tags as string[]
                    }

                }
            ]
        }
    });
    return result;
}

export const postService = {
    createPost,
    getAllPost
}