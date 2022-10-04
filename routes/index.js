import express from "express";
import PostSchema from "../schemas/post.js";

import commentRouter from "./comments.js";
import postRouter from "./post.js";
import userRouter from "./user.js";

const router = express.Router();


router.get("/", (req, res, next)=>{
    res.render("index.html")
});

router.get("/test", async(req, res, next)=>{
    const postList = await PostSchema.find({}, {"_id": 1});

    res.json({ postList })
});


router.use("/comments", commentRouter);
router.use("/posts", postRouter);
router.use("/user", userRouter);


export default router;