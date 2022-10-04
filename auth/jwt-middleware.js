import jwt from "jsonwebtoken";
import dotenv from "dotenv"

import UserModel from "../schemas/user.js";

dotenv.config();


// if (req.headers.authorization)으로 인증헤더 유무를 넣는다면 모든 라우터에도 사용 가능?
// res.locals을 쓰는 대신, req객체 자체에 추가로 변수를 넣을 수도 있음
// req.userId = payload.userId

export async function authMiddleware(req, res, next) {
    const authorization = String(req.headers.authorization);
    const [ tokentype, tokenvalue ] = authorization.split(" ");

    if (tokenvalue == "null") {
        res.locals.user = null;
        return next();
    }
    if (tokentype !== "Bearer") {
        res.status(401).send({ "message": "토큰값 에러" });
        return;
    }

    try {
        const token = jwt.verify(tokenvalue, process.env.JWT_KEY);
        const user = await UserModel.findById(token.userId);
        res.locals = { user };

        return next();        
    } catch (error) {
        res.status(401).send({ "message": "Please sign in"});
        console.error(error);
        return;
    }
}


export default authMiddleware;