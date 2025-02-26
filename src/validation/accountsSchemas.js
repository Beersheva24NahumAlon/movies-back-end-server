import Joi from "joi";
import { joiPasswordExtendCore } from "joi-password";
import config from "config";
import { email } from "./commonFields.js";

const joiPassword = Joi.extend(joiPasswordExtendCore);

const password = joiPassword
.string()
.min(8)
.minOfSpecialCharacters(1)
.minOfLowercase(1)
.minOfUppercase(1)
.minOfNumeric(1);
const role = Joi.string().valid(...(config.get("accounting.roles")));
const name = Joi.string().regex(/^[A-Za-z]+ [A-Za-z]+$/);

export const schemaEmail = Joi.object({
    email: email.required()
});
export const schemaEmailPassword = Joi.object({
    email: email.required(),
    password: password.required()
});
export const schemaEmailRole = Joi.object({
    email: email.required(),
    role: role.required()
});
export const schemaEmailNamePassword = Joi.object({
    email: email.required(),
    name: name.required(),
    password: password.required()
});




