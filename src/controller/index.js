import express from "express";
import moviesRouter from "../routes/movies.js";
import { errorHandler } from "../errors/errors.js";
import commentsRouter from "../routes/comments.js";
import accountsRouter from "../routes/accounts.js";
import favoritesRouter from "../routes/favorites.js";
import { logger, loggerAuth } from "../loggers/logger.js";
import { authenticate } from "../middleware/auth.js";

const port = process.env.PORT ?? 3600;

const app = express();

app.use(express.json());
app.use(logger);
app.use(loggerAuth);
app.use(authenticate());
app.use("/api/v1/movies", moviesRouter);
app.use("/api/v1/comments", commentsRouter);
app.use("/api/v1/accounts", accountsRouter);
app.use("/api/v1/favorites", favoritesRouter);
app.use((req, res) => res.status(404).send(`path ${req.path} is not found`));
app.use(errorHandler);

app.listen(port, () => console.log(`server is listening on port ${port}`));
