import config from "config";
import accountsService from "../service/AccountsService.js";

const userRole = config.get("accounting.user_role");
const premiumRole = config.get("accounting.premium_role");
const userGetLimit = config.get("limitation.user_requests_count");

const allGetAuthorization = async req => {
    const {req_count} = await accountsService.getRequestInformation(req.user);
    return req.role === premiumRole || (req.role === userRole && req_count <= userGetLimit);
}

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