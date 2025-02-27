import config from "config";
const adminRole = config.get("accounting.admin_role");

const actionJwtAdmin = {
    authentication: req => "jwt",
    authorization: req => req.role === adminRole
};
const accountsPaths = {
    POST: {
        "/admin": {
            authentication: req => "basic",
            authorization: req => req.user === process.env.SUPERUSER_NAME
        },
        "/user": {
            authentication: req => "",
            authorization: req => true
        }
    },
    PUT: {
        "/role": actionJwtAdmin,
        "/password": {
            authentication: req => "jwt",
            authorization: req => req.role === adminRole || req.user === req.body.email
        },
        "/block/:email": actionJwtAdmin,
        "/unblock/:email": actionJwtAdmin
    },
    GET: {
        "/:email": {
            authentication: req => "jwt",
            authorization: req => req.role === adminRole || req.user === req.params.email
        }
    },
    DELETE: {
        "/:email": {
            authentication: req => "jwt",
            authorization: req => req.role === adminRole || req.user === req.params.email
        }
    }
};
export default accountsPaths;