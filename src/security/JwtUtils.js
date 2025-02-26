import jwt from "jsonwebtoken";
import { getExpiresIn } from "../service/AccountsService.js";

export default class JwtUtils {

    static getJwt(seviceAccount) {
        return jwt.sign(
            { role: seviceAccount.role },
            process.env.JWT_SECRET,
            { subject: seviceAccount.email, expiresIn: getExpiresIn() + "" }
        );
    }

    static verifyJwt(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }

}