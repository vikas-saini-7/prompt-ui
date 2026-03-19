import mongoose from "mongoose";
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to your environment variables");
}

const uri = process.env.MONGODB_URI;
let cachedConnection: typeof mongoose | null = null;
let clientPromise: Promise<MongoClient>;

// Mongoose connection
if (process.env.NODE_ENV === "development") {
  // In development, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongooseConnection?: typeof mongoose;
  };

  if (!globalWithMongo._mongooseConnection) {
    globalWithMongo._mongooseConnection = mongoose;
  }
  cachedConnection = globalWithMongo._mongooseConnection;
} else {
  // In production, cache the connection.
  if (!cachedConnection) {
    cachedConnection = mongoose;
  }
}

// MongoClient connection for NextAuth adapter
if (process.env.NODE_ENV === "development") {
  let globalWithMongoClient = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };
  if (!globalWithMongoClient._mongoClientPromise) {
    const client = new MongoClient(uri);
    globalWithMongoClient._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongoClient._mongoClientPromise;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }

  try {
    await mongoose.connect(uri);
    return mongoose;
  } catch (error) {
    throw error;
  }
};

export default connectDB;
export { clientPromise };
