import { promisify } from "util";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

import redisClient from "./redis.js";

dotenv.config();


export default {
    sign: function(user) {
        const payload = {
            id: user.id,
            role: user.role
        }

        return jwt.sign(payload, process.env.JWT_KEY, {
            algorithm: "HS256",
            expiresIn: 60*60,
        });
    },
    verify: function(token) {
        try {
            const payload = jwt.verify(token, process.env.JWT_KEY);
            return {
                tokenFlag: true,
                payload
            };
        } catch (error) {
            return {
                tokenFlag: false,
                message: err.message
            };
        }
    },
    refresh: function() {
        return jwt.sign({}, process.env.JWT_KEY, {
            algorithm: "HS256",
            expiresIn: 60*60*24*14,
        });
    },
    refreshVerify: async function(refreshToken, userId) {
        const getAsync = promisify(redisClient.get).bind(redisClient);

        try {
            const data = await getAsync(userId);
            if (refreshToken === data) {
                try {
                    jwt.verify(refreshToken, process.env.JWT_KEY);
                    return true;
                } catch (error) {
                    return false;
                }
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
}