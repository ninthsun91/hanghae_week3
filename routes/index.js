import express from "express";
import PostSchema from "../schemas/post.js";
import CommentSchema from "../schemas/comment.js";

const router = express.Router();


router.get("/", (req, res, next)=>{
    res.render("index.html")
});


router.get("/test", async(req, res, next)=>{
    const postList = await PostSchema.find({}, {"_id": 1});

    res.json({ postList })
});

export default router;