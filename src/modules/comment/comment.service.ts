

const createComment = async (payload:{
    content: string;
    authorId: string;
    postId: string;
    parentCommentId?: string;

}) => {
    console.log('Creating a comment...',payload);
}

export  const  commentService = {
    createComment
};