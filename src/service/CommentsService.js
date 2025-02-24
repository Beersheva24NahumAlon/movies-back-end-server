import { createError } from "../errors/errors.js";
import mongoConnection from "../db/MongoConnection.js";
import config from "config";
import { ObjectId } from "mongodb";

class CommentsService {
    #comments

    constructor() {
        this.#comments = mongoConnection.getCollection(config.get("db.comments_collection"));
    }

    async getMovieComments(id) {
        const objectId = ObjectId.createFromHexString(id);
        const query = [
            { $match: { movie_id: objectId } },
            { $project: { email: 1, text: 1, _id: 0 } },
        ]
        const comments = await this.#comments.aggregate(query).toArray();
        if (!comments.length) {
            throw createError(404, `movie with id ${id} doesn't exist or doesn't have comments`);
        }
        return comments;
    }

    async addComment(comment) {
        const { email, movie_id, text } = comment;
        const objectMovieId = ObjectId.createFromHexString(movie_id);
        //TODO
    }
}

const commentsService = new CommentsService();
export default commentsService;