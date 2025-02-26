import express from "express";
import commentsService from "../service/CommentsService.js";
import expressAsyncHandler from "express-async-handler";
import { schemaId } from "../validation/moviesSchemas.js";
import { schemaEmail } from "../validation/accountsSchemas.js";
import { valitator } from "../middleware/validation.js";
import { schemaAddComment, schemaUpdateComment } from "../validation/commentsSchemas.js";

const commentsRouter = express.Router();

commentsRouter.get("/movie/:id", valitator(schemaId, "params"), expressAsyncHandler(async (req, res) => {
    res.send(await commentsService.getMovieComments(req.params.id))
}));
commentsRouter.get("/user/:email", valitator(schemaEmail, "params"), expressAsyncHandler(async (req, res) => {
    res.send(await commentsService.getUserComments(req.params.email))
}));
commentsRouter.post("/", valitator(schemaAddComment, "body"), expressAsyncHandler(async (req, res) => {
    res.status(201).send(await commentsService.addComment(req.body))
}));
commentsRouter.put("/", valitator(schemaUpdateComment, "body"), expressAsyncHandler(async (req, res) => {
    res.send(await commentsService.updateComment(req.body.commentId, req.body.text))
}));
commentsRouter.delete("/delete/:id", valitator(schemaId, "params"), expressAsyncHandler(async (req, res) => {
    res.send(await commentsService.deleteComment(req.params.id))
}));

export default commentsRouter;