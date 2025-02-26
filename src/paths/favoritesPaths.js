import config from "config";
import favoritesService from "../service/FavoritesService.js";

const userRole = config.get("accounting.user_role");
const premiumRole = config.get("accounting.premium_role");
const adminRole = config.get("accounting.admin_role");

const objectPutDelete = {
    authentication: req => "jwt",
    authorization: async req => {
        const favorite = await favoritesService.getFavorite(req.body.favoriteId);
        return req.role === premiumRole && req.user === favorite.email;
    }
}
const favoritesPaths = {
    POST: {
        "/": {
            authentication: req => "jwt",
            authorization: req => req.role === premiumRole
        }
    },
    GET: {
        "/:email": {
            authentication: req => "jwt",
            authorization: req => req.role === premiumRole && req.user === req.params.email
        }
    },
    PUT: {
        "/": objectPutDelete
    },
    DELETE: {
        "/": objectPutDelete
    }
};
export default favoritesPaths;