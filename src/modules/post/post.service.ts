import {prisma} from "../../lib/prisma";
import {Post} from "../../../generated/prisma/client";


const createPost = async (data: Omit<Post, "id" | "createdAt" | "updatedAt">) => {
    const result = await prisma.post.create({
        data
    })
    return result;
}

const getAllPost = async () => {
    const result = await prisma.post.findMany();
    return result;
}

export const postService = {
    createPost,
    getAllPost
}