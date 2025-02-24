import express from "express";
import commentsService from "../service/CommentsService.js";
import expressAsyncHandler from "express-async-handler";

const commentsRouter = express.Router();

commentsRouter.get("/:id", expressAsyncHandler(async (req, res) => {
    res.send(await commentsService.getMovieComments(req.params.id))
}));

export default commentsRouter;