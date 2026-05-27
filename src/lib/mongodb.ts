

import { MongoClient } from "mongodb";

const uri = process.env.MONGO_CONNECT_STRING!;

if (!uri) {
  throw new Error("MONGO_CONNECT_STRING is missing");
}

const client = new MongoClient(uri);

const mongoClient = client.connect();

export async function connectedDB() {
  const connectedClient = await mongoClient;

  return connectedClient.db("dreamStay");
}