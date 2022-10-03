import express from "express";
import async from "async";
import CommentModel from "../schemas/comment.js";
import PostModel from "../schemas/post.js"


const router = express.Router();


/**
 * 댓글목록 조회
 * 조회하는 게시글에 작성된 모든 댓글 목록
 * 작성날짜 기준 내림차순
 */
router.get("/:_postId", async(req, res, next)=>{
    const postId = req.params._postId;

    try {
        const { commentIds } = await PostModel
            .findById(postId)
            .select({"_id": 0, "commentIds": 1})
            .populate({
                path: "commentIds",
                select: {
                    "commentId": "$_id",
                    "_id": 0, "user": 1, "content": 1, "createdAt": 1,
                },
                options: {sort: {createdAt: -1}}
            });

        res.json({ data: commentIds });
    } catch (error) {
        return next(error);
    }
});


/**
 * 댓글 작성
 * 빈칸 > "댓글 내용을 입력해주세요"
 * 댓글 내용
 */
router.post("/:_postId", async (req, res, next)=>{
    const postId = req.params._postId;
    const comment = {
        postId: postId,
        user: req.body.user,
        password: req.body.password,
        content: req.body.content,
    };
    if (comment.content.length === 0) {
        return res.json({ "message": "댓글 내용을 입력해주세요." });
    }
    
    try {
        const createComment = await CommentModel.create(comment);
        const commentId = createComment._id;

        await PostModel.findByIdAndUpdate(postId, {"$push": {"commentIds": commentId}});

        res.json({ "message": "댓글을 생성하였습니다" });
    } catch (err) {
        return next(err);
    }
});


/**
 * 댓글수정
 * 빈칸 > "댓글 내용을 입력해주세요"
 * 댓글 내용
 */
router.put("/:_commentId", async(req, res, next)=>{
    const commentId = req.params._commentId;
    const { password, content } = req.body;

    if (content.length === 0) {
        return res.json({ "message": "댓글 내용을 입력해주세요." });
    }

    const updateComment = await CommentModel
        .updateOne({
            "_id": commentId,
            "password": password,
        }, {"$set": { content }});

    if (updateComment.matchedCount === 0) {
        return res.json({ "message": "비밀번호가 틀렸습니다" });
    }

    res.json({ "message": "댓글을 수정하였습니다." })
});
    

/**
 * 댓글삭제
 */
 router.delete("/:_commentId", async(req, res, next)=>{
    const commentId = req.params._commentId;

    const comment = await CommentModel.findOne({
                "_id": commentId,
                "password": req.body.password,
            });
    if (comment === null) {
        return res.json({ "message": "비밀번호가 틀렸습니다" });
    }

    const postId = comment.postId;
    async.parallel(
        {
            deleteComment: (callback)=>{
                CommentModel.findByIdAndDelete(commentId).exec(callback);
            },
            updatePost: (callback)=>{
                PostModel.findByIdAndUpdate(postId, {"$pull": {"commentIds": commentId}}).exec(callback);
            },
        },
        function (err, results) {
            if (err) {
                return next(err);
            }
            res.json({ "message": "댓글을 삭제하였습니다." });
        }
    );
});


export default router;
