import mongoose from "mongoose";


const CommentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: String, required: true },
    password: { type: String, required: true },
    content: { type: String, required: true },
}, { timestamps: true });


export default mongoose.model("Comment", CommentSchema);