import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalForMongoose = globalThis as unknown as { mongoose?: MongooseCache };

const cached: MongooseCache = globalForMongoose.mongoose ?? { conn: null, promise: null };

/**
 * Cached MongoDB connection for Next.js serverless / dev hot reload.
 */
export async function connectDb(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to your environment (e.g. .env.local).");
  }

  // readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (cached.promise && mongoose.connection.readyState === 2) {
    cached.conn = await cached.promise;
    globalForMongoose.mongoose = cached;
    return cached.conn;
  }

  if (cached.conn && mongoose.connection.readyState !== 1) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false });
  }

  cached.conn = await cached.promise;
  globalForMongoose.mongoose = cached;
  return cached.conn;
}
