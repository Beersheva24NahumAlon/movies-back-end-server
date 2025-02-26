import express from "express";
import favoritesService from "../service/FavoritesService.js";
import asyncHandler from "express-async-handler";
import { schemaAddFavorite, schemaDeleteFavorite, schemaUpdateFavorite } from "../validation/favoritesSchemas.js";
import { valitator } from "../middleware/validation.js";
import { schemaEmail } from "../validation/accountsSchemas.js";

const favoritesRouter = express.Router();

favoritesRouter.post("/", valitator(schemaAddFavorite, "body"), asyncHandler(async (req, res) => {
    res.status(201).send(await favoritesService.addFavorite(req.body));
}));
favoritesRouter.get("/:email", valitator(schemaEmail, "params"), asyncHandler(async (req, res) => {
    res.send(await favoritesService.getUserFavorites(req.params.email));
}));
favoritesRouter.put("/", valitator(schemaUpdateFavorite, "body"), asyncHandler(async (req, res) => {
    res.send(await favoritesService.updateFavorite(req.body.favoriteId, req.body));
}));
favoritesRouter.delete("/", valitator(schemaDeleteFavorite, "body"), asyncHandler(async (req, res) => {
    res.send(await favoritesService.deleteFavorite(req.body.favoriteId));
}));

export default favoritesRouter;