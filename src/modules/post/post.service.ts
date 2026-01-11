import {prisma} from "../../lib/prisma";
import {CommentStatus, Post, PostStatus} from "../../../generated/prisma/client";
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

    const allPost = await prisma.post.findMany({
        take: limit,
        skip,
        where: {
            AND: andConditions
        },
        orderBy: sortBy && sortOrder ? {
            [sortBy]: sortOrder
        } : {createdAt: 'desc'},
        include: {
            _count: {
                select: {Comment: true}
            }
        }
    });
    const total = await prisma.post.count({
        where: {
            AND: andConditions
        }
    })
    return {
        data: allPost,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

const getPostById = async (postId: string) => {
    return prisma.$transaction(async (tx) => {  // No await
        await tx.post.update({
            where: {id: postId},
            data: {viewCount: {increment: 1}}
        })

        return tx.post.findUnique({  // Return from transaction
            where: {id: postId},
            include: {
                Comment: {
                    where: {parentCommentId: null, status: CommentStatus.APPROVED},
                    orderBy: {createdAt: "desc"},
                    include: {
                        replies: {
                            where: {status: CommentStatus.APPROVED},
                            orderBy: {createdAt: "asc"},
                            include: {
                                replies: {
                                    where: {status: CommentStatus.APPROVED},
                                    orderBy: {createdAt: "asc"}
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {Comment: true}
                }
            }
        })
    })
}

const getMyPost = async (authorId:string)=>{
    await prisma.user.findUnique(
        {
            where:{
                id:authorId,
                status:"ACTIVE"

            }})
    const result = await prisma.post.findMany({
        where: {
            authorId
    },
        orderBy: {
            createdAt:"desc"
        },
        include:{
            _count:{
                select:{Comment:true}
            }
        }

    });
    const total = await prisma.post.count({
        where: {
            authorId
        },
    })


    return {
        data:result,
        total
    };

}




const updatePost =async (postId:string,data :Partial<Post>,authorId: string)=>{
    console.log({
        postId,
        data,
        authorId
    })

    const postData = await prisma.post.findUnique({
        where:{id:postId},
        select:{authorId:true,id:true}
    })
    if(postData.authorId !== authorId){
        throw new Error("You are not authorized to update this post!")
    }
    const result = await prisma.post.update({
        where:{
            id:postData.id,

        },
        data
    })
    return result;
}

export const postService = {
    createPost,
    getAllPost,
    getPostById,
    getMyPost,
    updatePost

}