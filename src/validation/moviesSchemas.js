import Joi from "joi";
import { id } from "./commonFields.js";

const CINENA_EPOCH_BEGIN = 1890;
const nextYear = new Date().getFullYear() + 1;

const imdbId = Joi.number();
const rating = Joi.number().valid(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
const actor = Joi.string().regex(/^[A-Za-z ]+$/);
const amount = Joi.number();
const genres = Joi.array().items(Joi.string());
const languages = Joi.array().items(Joi.string());
const year = Joi.number().greater(CINENA_EPOCH_BEGIN).less(nextYear);

export const schemaId = Joi.object({
    id: id.required()
});
export const schemaFilter = Joi.object({
    year,
    actor,
    genres,
    languages,
    amount: amount.required()
});
export const schemaRating = Joi.object({
    imdbId: imdbId.required(),
    rating: rating.required()
});





