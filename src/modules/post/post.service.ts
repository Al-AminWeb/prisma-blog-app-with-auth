import {prisma} from "../../lib/prisma";
import {Post} from "../../../generated/prisma/client";


const createPost = async (data: Omit<Post, "id" | "createdAt" | "updatedAt">) => {
    const result = await prisma.post.create({
        data
    })
    return result;
}

const getAllPost = async (payload:{search:string | undefined}) => {
    const result = await prisma.post.findMany({
        where:{
            title :{
                contains: payload.search as string,
                mode: 'insensitive'

            }
        }
    });
    return result;
}

export const postService = {
    createPost,
    getAllPost
}