import config from "config";
const adminRole = config.get("accounting.admin_role");

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
        "/role": {
            authentication: req => req.authType,
            authorization: req => req.user === req.body.email
        },
        "/password": {
            authentication: req => req.authType,
            authorization: req => req.user === process.env.SUPERUSER_NAME || req.user === req.body.email
        },
        "/block/:email": {
            authentication: req => req.authType,
            authorization: req => req.user === process.env.SUPERUSER_NAME
        },
        "/unblock/:email": {
            authentication: req => req.authType,
            authorization: req => req.user === process.env.SUPERUSER_NAME
        }
    },
    GET: {
        "/:email": {
            authentication: req => req.authType,
            authorization: req => req.user === process.env.SUPERUSER_NAME || req.user === req.params.email
        }
    },
    DELETE: {
        "/:email": {
            authentication: req => req.authType,
            authorization: req => req.user === process.env.SUPERUSER_NAME || req.user === req.params.email
        }
    }
};
export default accountsPaths;