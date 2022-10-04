import bcrypt from "bcrypt";

import jwt from "./jwt-util.js";
import redisClient from "./redis.js";
import UserModel from "../schemas/user.js";


export async function login(req, res, next) {
    console.log("THIS IS REFRESHTOKEN LOGIN")
    const { username, password } = req.body;

    try {
        console.log("FIND USER")
        const user = await UserModel.findOne({ username });
        console.log("user: ", user)
        const check = await bcrypt.compare(password, user.password);
        console.log("check: ", check)

        if (!check) {
            console.log("INCORRECT PASSWORD")
            return res.status(401).json({
                tokenFlag: false,
                message: "incorrect password"
            });
        }
        console.log("CREATE TOKENS");
        const accessToken = jwt.sign(user);
        const refreshToken = jwt.refresh();
    
        console.log("SET REDIS")
        redisClient.set(user._id, refreshToken)   // { userId: refreshToken } stored in redis
    
        res.status(200).json({
            tokenFlag: true,
            data: {
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
}


export async function refresh(req, res, next) {
    // 인증 헤더가 있었으니까 refresh 요청으로 이어질 수 있는거겠지만...
    // 보안을 위한 재확인?
    if (req.headers.authorization && req.headers.refresh) {
        const authToken = req.headers.authorization.split(" ")[1];
        const refreshToken = req.headers.refresh;

        const { tokenFlag, payload } = jwt.verify(authToken);
        if (payload === null) {
            return res.status(401).json({
                tokenFlag: false,
                message: "INVALID AUTHTOKEN"
            });
        }

        const refreshCheck = jwt.refreshVerify(refreshToken, payload.userId);
        if (!tokenFlag) {
            if (!refreshCheck) {
                res.status(401).json({
                    tokenFlag: false,
                    message: "REFRESH TOKEN EXPIRED"
                })
            } else {
                const newAuthToken = jwt.sign({ userId: payload.userId, userRold: payload.userRole })

                res.status(200).json({
                    tokenFlag: true,
                    data: {
                        authToken: newAuthToken,
                        refreshToken,
                    }
                });
            }
        } else {
            res.status(400).json({
                tokenFlag: true,
                message: "AUTH TOKEN STILL AVAILABLE"
            });
        }
    } else {
        res.status(400).json({
            tokenFlag: false,
            message: "NO VALID TOKEN FOUND IN HEADER"
        });
    }
}