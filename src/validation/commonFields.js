import Joi from "joi";

const TEXT_MIN_LENGTH = 3;

export const email = Joi.string().email();
export const id = Joi.string().hex().length(24);
export const text = Joi.string().min(TEXT_MIN_LENGTH);