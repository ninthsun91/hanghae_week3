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
import { login } from "../auth/login-refreshtoken.js";
import { authMiddleware } from "../auth/jwt-middleware.js";
router.post("/signin", login)

// 클라이언트로부터 받는 헤더
// {
//   "Authorizaiton": "Bearer access-token",
//   "Refresh": "refresh-token"
// }

router.get("/refresh")
// logintoken expired, but refreshtoken valid
// 클라이언트에서 refresh 재요청


// router.post("/signin", async(req, res, next)=>{
//     const { username, password } = req.body;
//     const saltRounds = Number(process.env.ROUNDS);

//     try {
//         const user = await UserModel.findOne({"username": username})
//         console.log(user);
    
//         const check = await bcrypt.compare(password, user.password);
//         if (!check) {
//             return res.status(400).json({ "message": "WRONG PASSWORD"});
//         }

//         const payload = {
//             username: username,
//         }
//         const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: 60*60 });
    
//         res.status(200)
//             .append("token", token)
//             .json({ "message": "SUCCESS" });        
//     } catch (error) {
//         console.error(error);
//         return next(error);
//     }
// });


export default router;