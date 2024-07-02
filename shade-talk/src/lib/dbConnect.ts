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
    // connection.isConnected = 1;
    connection.isConnected = db.connections[0].readyState;
    console.log(
      "Connected to MongoDB Successfully:",
      db.connection.db.databaseName
    );
  } catch (error) {
    console.log("Database connection filed:", error);

    process.exit(1);
  }
}

export default dbConnect; 
