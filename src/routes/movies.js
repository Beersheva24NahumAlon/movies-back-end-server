import express from "express";
import moviesService from "../service/MoviesService.js";
import expressAsyncHandler from "express-async-handler";
import { schemaId, schemaRating, schemaFilter } from "../validation/moviesSchemas.js";
import { valitator } from "../middleware/validation.js";
import { checkAuthentication } from "../middleware/auth.js";
import moviesPaths from "../paths/moviesPaths.js";

const moviesRouter = express.Router();

moviesRouter.get("/movie/:id", valitator(schemaId, "params"), checkAuthentication(moviesPaths), expressAsyncHandler(async (req, res) => {
    res.send(await moviesService.getMovie(req.params.id))
}));
moviesRouter.get("/mostrated", valitator(schemaFilter, "body"), checkAuthentication(moviesPaths), expressAsyncHandler(async (req, res) => {
    res.send(await moviesService.getMostRated(req.body));
}));
moviesRouter.get("/mostcommented", valitator(schemaFilter, "body"), checkAuthentication(moviesPaths), expressAsyncHandler(async (req, res) => {
    res.send(await moviesService.getMostCommented(req.body));
}));
moviesRouter.post("/rate", valitator(schemaRating, "body"), checkAuthentication(moviesPaths), expressAsyncHandler(async (req, res) => {
    res.send({number: await moviesService.addRate({...req.body, email: req.user})});
}));

export default moviesRouter;