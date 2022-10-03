import express from "express";
import PostModel from "../schemas/post.js";
import CommentModel from "../schemas/comment.js";


const router = express.Router();


/**
 * 전체 게시글 목록 목록 조회
 * 제목, 작성자명, 작성날짜
 * 작성날짜 내림차순
 */
router.get("/", async(req, res, next)=>{
    try {
        const data = await PostModel
            .find()
            .select({
                "_id": 0, "title": 1, "user": 1, "createdAt": 1,
                "postId": "$_id"
            })
            .sort({ "createdAt": "desc" });
        
        res.status(200).json({ data });
    } catch (error) {
        return next(error);
    }
});


/**
 * 게시글 조회
 * 제목, 작성자명, 작성내용, 작성날짜
 */
router.get("/:_postId", async (req, res, next)=>{
    const data = await PostModel
        .findById(req.params._postId)
        .select({
            "_id": 0, "title": 1, "user": 1, "content": 1, "createdAt": 1,
            "postId": "$_id"
        });
    if (data === null) {
        const error = new Error("BAD REQUEST");
        res.status(400).json({ "message": error.message });
    }
    
    res.json({ data });
});


/**
 * 게시글 작성
 * 제목, 작성자명, 비밀번호, 작성내용
 */
router.post("/", async(req, res, next)=>{
    const doc = {
        user: req.body.user,
        password: req.body.password,
        title: req.body.title,
        content: req.body.content,
        commentIds: []
    };
    
    try {
        await PostModel.create(doc);
        
        res.json({ "message": "게시글을 생성하였습니다." });        
    } catch (error) {
        return next(error);
    }    
});


/**
 * 비밀번호가 동일할때만 글 수정
 */
router.put("/:_postId", async(req, res, next)=>{
    const doc = {
        password: req.body.password,
        title: req.body.title,
        content: req.body.content,
    };

    const result = await PostModel
        .updateOne({
            "_id": req.params._postId,
            "password": doc.password,
        }, {"$set": doc})
        
    if (result.modifiedCount === 0) {
        return res.json({ "message": "비밀번호가 틀렸습니다." });
    }
    res.json({ "message": "게시글을 수정하였습니다." });
});


/**
 * 비밀번호가 동일할때만 글 삭제
 */
 router.delete("/:_postId", async(req, res, next)=>{
    const post = await PostModel.findOneAndDelete({
        "_id": req.params._postId,
        "password": req.body.password,
    });

    if (post === null) {
        return res.json({ "message": "비밀번호가 틀렸습니다." });
    }
    
    const commentIds = post.commentIds;
    if (commentIds.length > 0) {
        for (const commentId of commentIds) {
            await CommentModel.findByIdAndDelete(commentId);
        }
    }    

    res.json({ "message": "게시글을 삭제하였습니다" });
});



/**
 * populate() 써봅시다
 * post 불러오면서, commentIds > 해당 comment doc 불러오기 * 
 */
router.get("/populate/:_postId", async(req, res, next)=>{
    const postId = req.params._postId;
    try {
        const post = await PostModel
            .findById(postId)
            .select("user title content updatedAt")
            .populate({
                path: "commentIds",
                model: "Comment",
                select: "user content updatedAt",
                sort: "desc",
            });

        res.json({ post });
    } catch (error) {
        return next(error);
    }    
});


export default router;
