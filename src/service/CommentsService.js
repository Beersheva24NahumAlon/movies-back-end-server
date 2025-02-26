import { createError } from "../errors/errors.js";
import mongoConnection from "../db/MongoConnection.js";
import config from "config";
import { ObjectId } from "mongodb";
import accountsService from "./AccountsService.js";

class CommentsService {
    #comments
    #movies

    constructor() {
        this.#comments = mongoConnection.getCollection(config.get("db.comments_collection"));
        this.#movies = mongoConnection.getCollection(config.get("db.movies_collection"));
    }

    async getMovieComments(id) {
        const query = [
            { $match: { movie_id: ObjectId.createFromHexString(id) } },
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
        const resUser = await accountsService.getAccount(email);
        const objectMovieId = ObjectId.createFromHexString(movie_id);
        const objectToAdd = {movie_id: objectMovieId, email, user: resUser.name, text, date: new Date()};
        await this.#incNumOfComments(objectMovieId);
        const resComment = await this.#comments.insertOne(objectToAdd);
        if (!resComment) {
            throw createError(400, `comment hasn't added`);
        }
        return objectToAdd;
    }

    async #incNumOfComments(objectMovieId) {
        const resMovie = await this.#movies.findOneAndUpdate(
            { _id: objectMovieId },
            { $inc: { num_mflix_comments: 1 } }
        );
        if (!resMovie) {
            throw createError(404, `movie with id ${id} doesn't exist`);
        }
    }

    async updateComment(comment) {
        const {_id, email, text } = comment;
        const resUser = await accountsService.getAccount(email);
        const objectId = ObjectId.createFromHexString(_id);
        const resComment = await this.#comments.findOneAndUpdate(
            { _id: objectId },
            { $set: { text } },
            { returnDocument: "after" }
        );
        if (!resComment) {
            throw createError(404, `comment with id ${_id} doesn't exist`);
        }
        return resComment;
    }

    async getUserComments(email) {
        const resComments = await this.#comments.find( { email } ).toArray();
        if (!resComments.length) {
            throw createError(404, `user with e-mail ${email} doesn't have any comments`);
        }
        return resComments;
    }

    async deleteComment(id) {
        const objectId = ObjectId.createFromHexString(id);
        const resComment = await this.#comments.findOneAndDelete( {_id: objectId} );
        if (!resComment) {
            throw createError(404, `comment with id ${id} doesn't exist`);
        }
        const resMovie = await this.#movies.findOneAndUpdate(
            { _id: resComment.movie_id },
            { $inc: { num_mflix_comments: -1 } }
        );
        if (!resMovie) {
            throw createError(404, `movie with id ${move_id} doesn't exist`);
        }
        return resComment;
    }
}

const commentsService = new CommentsService();
export default commentsService;