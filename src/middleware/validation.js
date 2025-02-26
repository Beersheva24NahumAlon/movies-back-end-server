import { createError } from "../errors/errors.js";

export function valitator(schema) {
    return (req, res, next) => {
        const objectToValid = req.params ? req.params : req.body;
        const { error } = schema.validate(objectToValid, { abortEarly: false });
        if (error) {
            throw createError(400, error.details.map(o => o.message).join(", "));
        }
        next();
    };
}
