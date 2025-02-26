import { createError } from "../errors/errors.js";

export function valitator(schema, objectToValid) {
    return (req, res, next) => {
        const { error } = schema.validate(req[objectToValid], { abortEarly: false });
        if (error) {
            throw createError(400, error.details.map(o => o.message).join(", "));
        }
        next();
    };
}
