// imports
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import commentRouter from "./routes/comments.js";
import indexRouter from "./routes/index.js";
import postRouter from "./routes/post.js";

dotenv.config();

// express
const app = express();
const PORT = process.env.PORT;


import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// view engine
import { renderFile } from "ejs";
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("html", renderFile)

// static path


// middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// routers
app.use("/", indexRouter);
app.use("/comments", commentRouter);
app.use("/posts", postRouter);


// db
const URL = process.env.MONGODB
mongoose.connect(URL)
    // .catch((err)=>console.error.bind(console, "MongoDB connection fail"))
    .catch((err)=>console.error(err))
    .then(()=>{
        console.log("MongoDB connection success");

        app.listen(PORT, ()=>{
            console.log(`Server running on PORT ${PORT}`);
        });
    });


// error handler
