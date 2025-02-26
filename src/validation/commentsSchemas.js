import Joi from "joi";
import { id, email, text } from "./commonFields.js";

export const schemaAddComment = Joi.object({
    email: email.required(),
    text: text.required(),
    movie_id: id.required(),
});
export const schemaUpdateComment = Joi.object({
    email,
    text: text.required(),
    commentId: id.required(),
});





