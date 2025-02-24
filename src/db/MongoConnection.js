import { MongoClient } from "mongodb"
import config from "config";

const { MONGO_PASSWORD, MONGO_USER, MONGO_CLUSTER } = process.env;

class MongoConnection {
    #client
    #db

    constructor(connectionStr, dbName) {
        this.#client = new MongoClient(connectionStr);
        this.#db = this.#client.db(dbName);
    }

    getCollection(collectionName) {
        return this.#db.collection(collectionName);
    }

    async close() {
        await this.#client.close();
    }
}
const dbName = config.get("db.db_name");
const connectionStr = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER.toLowerCase()}.dvztv.mongodb.net/?retryWrites=true&w=majority&appName=${MONGO_CLUSTER}`;
const mongoConnection = new MongoConnection(connectionStr, dbName);
export default mongoConnection;