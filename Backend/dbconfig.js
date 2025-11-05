import { MongoClient } from "mongodb";
import "dotenv/config"

const url = process.env.DATABASE_URL;
const dbName = process.env.DATABASE_NAME;
export const collectionName = process.env.DB_COLLECTION_NAME;
const client = new MongoClient(url);
export const connection = async() => {
    const connect = await client.connect();
    return await connect.db(dbName);
}