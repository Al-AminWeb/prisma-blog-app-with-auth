import {prisma} from "../../lib/prisma";
import {Post} from "../../../generated/prisma/client";
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
        tags
    }:
    {
        search: string | undefined,
        tags: string[] | [],
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


    const result = await prisma.post.findMany({
        where: {
            AND: andConditions
        }
    });
    return result;
}

export const postService = {
    createPost,
    getAllPost
}