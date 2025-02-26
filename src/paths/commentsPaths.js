import config from "config";
import commentsService from "../service/CommentsService.js";

const userRole = config.get("accounting.user_role");
const premiumRole = config.get("accounting.premium_role");
const adminRole = config.get("accounting.admin_role");

const commentsPaths = {
    POST: {
        "/": {
            authentication: req => "jwt",
            authorization: req => req.role === premiumRole
        },
    },
    GET: {
        "/movie/:id": {
            authentication: req => "jwt",
            authorization: req => true
        },
        "/user/:email": {
            authentication: req => "jwt",
            authorization: req => true
        },
    },
    PUT: {
        "/": {
            authentication: req => "jwt",
            authorization: async req => {
                const comment = await commentsService.getComment(req.body.commentId);
                return req.role === premiumRole && req.user === comment.email;
            }
        },
    },
    DELETE: {
        "/delete/:id": {
            authentication: req => "jwt",
            authorization: async req => {
                const comment = await commentsService.getComment(req.params.id);
                return req.role === adminRole || (req.role === premiumRole && req.user === comment.email);
            }
        },
    }
};
export default commentsPaths;