import { MongoClient, ServerApiVersion } from "mongodb";

import { dbPass, dbUser } from "./env.js";

const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.otdu5.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db("TechElevate");

const collections = {
  users: db.collection("users"),
  products: db.collection("products"),
  reviews: db.collection("reviews"),
  coupons: db.collection("coupons"),
};

let connectionPromise;

const connectToDatabase = async () => {
  if (!connectionPromise) {
    connectionPromise = client.connect();
  }

  await connectionPromise;
  return { client, db, collections };
};

export { client, db, collections, connectToDatabase };
