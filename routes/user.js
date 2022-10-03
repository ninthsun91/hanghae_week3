import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../schemas/user.js";


const router = express.Router();
dotenv.config();


// sign up
router.post("/signup", (req, res, next)=>{
    const saltRounds = Number(process.env.ROUNDS);
    bcrypt.hash(req.body.password, saltRounds, async(err, hash)=>{
        if (err) {
            return res.status(500).json({ "message": "HASHING FAIL" });
        }
        
        try {
            const user = await UserModel.create({
                username: req.body.username,
                password: hash,
             });
            if (user === null) {
                return res.status(500).json({ "message": "Signup failed" });
            }
    
            res.status(200).json({ "message": "SUCCESS" });        
        } catch (error) {
            console.error(error);
            return next(error);
        }    
    });    
});


// sign in
router.post("/signin", async(req, res, next)=>{
    const { username, password } = req.body;
    const saltRounds = Number(process.env.ROUNDS);

    try {
        const user = await UserModel.findOne({"username": username})
        console.log(user);
    
        const check = await bcrypt.compare(password, user.password);
        if (!check) {
            return res.status(400).json({ "message": "WRONG PASSWORD"});
        }

        const payload = {
            username: username,
        }
        const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: 60*60 });
    
        res.status(200)
            .append("token", token)
            .json({ "message": "SUCCESS" });        
    } catch (error) {
        console.error(error);
        return next(error);
    }
});


export default router;