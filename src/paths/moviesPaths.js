import config from "config";
const userRole = config.get("accounting.user_role");
const premiumRole = config.get("accounting.premium_role");
const adminRole = config.get("accounting.admin_role");

const allGetAuthorization = req => req.role === premiumRole //|| (req.role === userRole && getCountOfRequests(req.user));

const moviesPaths = {
    POST: {
        "/rate": {
            authentication: req => "jwt",
            authorization: req => req.role === premiumRole
        },
    },
    GET: {
        "/movie/:id": {
            authentication: req => "jwt",
            authorization: allGetAuthorization
        },
        "/mostrated": {
            authentication: req => "jwt",
            authorization: allGetAuthorization
        },
        "/mostcommented": {
            authentication: req => "jwt",
            authorization: allGetAuthorization
        },
    },
};
export default moviesPaths;