import express from "express";
import moviesService from "../service/MoviesService.js";
import expressAsyncHandler from "express-async-handler";

const moviesRouter = express.Router();

moviesRouter.get("/movie/:id", expressAsyncHandler(async (req, res) => {
    res.send(await moviesService.getMovie(req.params.id))
}));
moviesRouter.get("/mostrated/", expressAsyncHandler(async (req, res) => {
    res.send(await moviesService.getMostRated(req.body));
}));
moviesRouter.get("/mostcommented/", expressAsyncHandler(async (req, res) => {
    res.send(await moviesService.getMostCommented(req.body));
}));
moviesRouter.post("/rate/", expressAsyncHandler(async (req, res) => {
    res.send({number: await moviesService.addRate(req.body)});
}));

export default moviesRouter;