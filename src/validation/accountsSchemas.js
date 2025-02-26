import Joi from "joi";
import { joiPasswordExtendCore } from "joi-password";
import config from "config";

const joiPassword = Joi.extend(joiPasswordExtendCore);

//fields
const email = Joi.string().email();
const password = joiPassword
.string()
.min(8)
.minOfSpecialCharacters(1)
.minOfLowercase(1)
.minOfUppercase(1)
.minOfNumeric(1);
const role = Joi.string().allow(...config.get("accounting.roles"));
const name = Joi.string().regex(/^[A-Za-z]+ [A-Za-z]+$/);

//schemas
export const schemaEmail = Joi.object({
    email: email.required()
});
export const schemaUpdatePassword = Joi.object({
    email: email.required(),
    password: password.required()
});




