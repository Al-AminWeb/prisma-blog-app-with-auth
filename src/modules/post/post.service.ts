import {prisma} from "../../lib/prisma";
import {Post, PostStatus} from "../../../generated/prisma/client";
import {PostWhereInput} from "../../../generated/prisma/models/Post";


const createPost = async (data: Omit<Post, "id" | "createdAt" | "updatedAt">) => {
    const result = await prisma.post.create({
        data
    })
    return result;
}

const getAllPost = async (
    {
        search,
        tags,
        isFeatured,
        status,
        authorId,
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }:
    {
        search: string | undefined,
        tags: string[] | [],
        isFeatured: boolean | undefined,
        status: PostStatus | undefined,
        authorId: string | undefined
        page: number,
        limit: number
        skip: number,
        sortBy: string | undefined,
        sortOrder: string | undefined


    }) => {
    const andConditions: PostWhereInput[] = []
    if (search) {
        andConditions.push(
            {
                OR: [
                    {
                        title: {
                            contains: search,
                            mode: 'insensitive'

                        },
                    },
                    {
                        content: {
                            contains: search,
                            mode: "insensitive"
                        }
                    },
                    {
                        tags: {
                            has: search
                        }

                    }


                ]
            },
        )
        ;
    }

    if (tags.length > 0) {
        andConditions.push({
            tags: {
                hasEvery: tags as string[]
            }
        })
    }

    if (typeof isFeatured === 'boolean') {
        andConditions.push({
            isFeatured
        })
    }

    if (status) {
        andConditions.push({
            status
        })
    }

    if (authorId) {
        andConditions.push({
            authorId
        })
    }


    const result = await prisma.post.findMany({
        take: limit,
        skip,
        where: {
            AND: andConditions
        },
        orderBy: sortBy && sortOrder ? {
            [sortBy]: sortOrder
        }: { createdAt: 'desc' }
    });
    return result;
}

export const postService = {
    createPost,
    getAllPost
}