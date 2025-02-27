import config from "config";
import favoritesService from "../service/FavoritesService.js";

const premiumRole = config.get("accounting.premium_role");

const actionJwtPremOwner = {
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
        "/": actionJwtPremOwner
    },
    DELETE: {
        "/": actionJwtPremOwner
    }
};
export default favoritesPaths;