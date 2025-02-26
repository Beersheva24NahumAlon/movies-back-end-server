import express from "express";
import moviesService from "../service/MoviesService.js";
import expressAsyncHandler from "express-async-handler";
import { schemaId, schemaRating, schemaFilter } from "../validation/moviesSchemas.js";
import { valitator } from "../middleware/validation.js";

const moviesRouter = express.Router();

moviesRouter.get("/movie/:id", valitator(schemaId, "params"), expressAsyncHandler(async (req, res) => {
    res.send(await moviesService.getMovie(req.params.id))
}));
moviesRouter.get("/mostrated/", valitator(schemaFilter, "body"), expressAsyncHandler(async (req, res) => {
    res.send(await moviesService.getMostRated(req.body));
}));
moviesRouter.get("/mostcommented/", valitator(schemaFilter, "body"), expressAsyncHandler(async (req, res) => {
    res.send(await moviesService.getMostCommented(req.body));
}));
moviesRouter.post("/rate/", valitator(schemaRating, "body"), expressAsyncHandler(async (req, res) => {
    res.send({number: await moviesService.addRate(req.body)});
}));

export default moviesRouter;