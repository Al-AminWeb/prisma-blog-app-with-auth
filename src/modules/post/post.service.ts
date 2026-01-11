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




const updatePost = async (postId: string, data: Partial<Post>, authorId: string, isAdmin: boolean) => {
    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        },
        select: {
            id: true,
            authorId: true
        }
    })

    if (!isAdmin && (postData.authorId !== authorId)) {
        throw new Error("You are not the owner/creator of the post!")
    }

    if (!isAdmin) {
        delete data.isFeatured
    }

    const result = await prisma.post.update({
        where: {
            id: postData.id
        },
        data
    })

    return result;

}


const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {
    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        },
        select: {
            id: true,
            authorId: true
        }
    })

    if (!isAdmin && (postData.authorId !== authorId)) {
        throw new Error("You are not the owner/creator of the post!")
    }

    return  prisma.post.delete({
        where: {
            id: postId
        }
    })

}

const getStats = async () => {
    return  prisma.$transaction(async (tx) => {
        const [
            totalPosts,
            publishedPosts,
            draftPosts,
            archivedPosts,
            totalComments,
            approvedComments,
            totalUsers,
            adminCount,
            userCount,
            viewsAggregate  // This will contain viewCount sum
        ] = await Promise.all([
            tx.post.count(),
            tx.post.count({ where: { status: PostStatus.PUBLISHED } }),
            tx.post.count({ where: { status: PostStatus.DRAFT } }),
            tx.post.count({ where: { status: PostStatus.ARCHIVED } }),
            tx.comment.count(),
            tx.comment.count({ where: { status: CommentStatus.APPROVED } }),
            tx.user.count(),
            tx.user.count({ where: { role: "ADMIN" } }),
            tx.user.count({ where: { role: "USER" } }),
            tx.post.aggregate({
                _sum: {
                    viewCount: true  // Changed from 'views' to 'viewCount'
                }
            })
        ]);

        // Handle the nullable aggregate result
        const totalViews = viewsAggregate._sum?.viewCount ?? 0;

        return {
            totalPosts,
            publishedPosts,  // Fixed the typo
            draftPosts,
            archivedPosts,
            totalComments,
            approvedComments,  // Fixed variable name consistency
            totalUsers,
            adminCount,
            userCount,
            totalViews
        };
    });
};


export const postService = {
    createPost,
    getAllPost,
    getPostById,
    getMyPost,
    updatePost,
    deletePost,
    getStats

}