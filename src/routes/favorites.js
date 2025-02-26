import express from "express";
import favoritesService from "../service/FavoritesService.js";
import asyncHandler from "express-async-handler";

const favoritesRouter = express.Router();

favoritesRouter.post("/", asyncHandler(async (req, res) => {
    const favorite = await favoritesService.addFavorite(req.body);
    res.status(201).send(favorite);
}));
favoritesRouter.get("/:email", asyncHandler(async (req, res) => {
    const favorites = await favoritesService.getUserFavorites(req.params.email);
    res.send(favorites);
}));
favoritesRouter.put("/", asyncHandler(async (req, res) => {
    const favorites = await favoritesService.updateFavorite(req.body.favoriteId, req.body);
    res.send(favorites);
}));
favoritesRouter.delete("/", asyncHandler(async (req, res) => {
    const favorites = await favoritesService.deleteFavorite(req.body.favoriteId);
    res.send(favorites);
}));

export default favoritesRouter;