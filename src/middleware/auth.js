import { createError } from "../errors/errors.js";
import JwtUtils from "../security/JwtUtils.js";
import accountsService from "../service/AccountsService.js";
import expressAsyncHandler from "express-async-handler";

const BEARER = "Bearer ";
const BASIC = "Basic ";

export function authenticate() {
    return async (req, res, next) => {
        const authHeader = req.header("Authorization");
        if (authHeader) {
            if (authHeader.startsWith(BEARER)) {
                jwtAuthentication(req, authHeader);
            } else if (authHeader.startsWith(BASIC)) {
                await basicAuthentication(req, authHeader);
            }
        }
        next();
    };
}

function jwtAuthentication(req, authHeader) {
    const token = authHeader.substring(BEARER.length);
    try {
        const payload = JwtUtils.verifyJwt(token);
        req.user = payload.sub;
        req.role = payload.role;
        req.authType = "jwt";
    } catch (error) {
    }
}

async function basicAuthentication(req, authHeader) {
    const emailPasswordBase64 = authHeader.substring(BASIC.length);
    const emailPassword = Buffer.from(emailPasswordBase64, "base64").toString("utf-8");
    const [email, password] = emailPassword.split(":");

    try {
        if (email === process.env.SUPERUSER_NAME) {
            if (password === process.env.SUPERUSER_PASSWORD) {
                req.user = process.env.SUPERUSER_NAME;
                req.role = "";
                req.authType = "basic";
            }
        } else {
            const serviceAccount = await accountsService.getAccount(email);
            await accountsService.checkLogin(serviceAccount, password);
            req.user = email;
            req.role = serviceAccount.role;
            req.authType = "basic";
        }
    } catch (error) { 
    }
}

export function checkAuthentication(paths) {
    return expressAsyncHandler(async (req, res, next) => {
        const { authentication, authorization } = paths[req.method][req.route.path];
        if (!authorization) {
            throw createError(500, "security configuration not provided");
        }
        if (authentication(req)) {
            if (req.authType !== authentication(req)) {
                throw createError(401, "no required authentication");
            }
        }
        if (!await authorization(req)) {
            throw createError(403, "action not permited");
        }
        next();
    });
}