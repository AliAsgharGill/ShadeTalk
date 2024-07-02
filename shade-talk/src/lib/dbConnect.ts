import { log } from "console";
import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Using existing connection");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    connection.isConnected = db.connections?.[0]?.readyState || 0;

    const dbName = db.connection?.db?.databaseName;
    if (dbName) {
      console.log("Connected to MongoDB Successfully:", dbName);
    } else {
      console.log("Connected to MongoDB, but could not determine database name");
    }
  } catch (error) {
    console.log("Database connection failed:", error);
    process.exit(1);
  }
}

export default dbConnect;
