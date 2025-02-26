import express from "express";
import commentsService from "../service/CommentsService.js";
import expressAsyncHandler from "express-async-handler";

const commentsRouter = express.Router();

commentsRouter.get("/movie/:id", expressAsyncHandler(async (req, res) => {
    res.send(await commentsService.getMovieComments(req.params.id))
}));
commentsRouter.get("/user/:id", expressAsyncHandler(async (req, res) => {
    res.send(await commentsService.getUserComments(req.params.id))
}));
commentsRouter.post("/", expressAsyncHandler(async (req, res) => {
    res.status(201).send(await commentsService.addComment(req.body))
}));
commentsRouter.put("/", expressAsyncHandler(async (req, res) => {
    res.send(await commentsService.updateComment(req.body))
}));
commentsRouter.delete("/delete/:id", expressAsyncHandler(async (req, res) => {
    res.send(await commentsService.deleteComment(req.params.id))
}));

export default commentsRouter;