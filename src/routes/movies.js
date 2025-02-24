import express from "express";
import moviesService from "../service/MoviesService.js";
import expressAsyncHandler from "express-async-handler";

const moviesRouter = express.Router();

moviesRouter.get("/:id", expressAsyncHandler(async (req, res) => {
    res.send(await moviesService.getMovie(req.params.id))
}));
moviesRouter.post("/mostrated/", expressAsyncHandler(async (req, res) => {
    res.send(await moviesService.getMostRated(req.body));
}));
moviesRouter.post("/mostcommented/", expressAsyncHandler(async (req, res) => {
    res.send(await moviesService.getMostCommented(req.body));
}));
moviesRouter.put("/rate/", expressAsyncHandler(async (req, res) => {
    res.send(await moviesService.addRate(req.body));
}));

export default moviesRouter;