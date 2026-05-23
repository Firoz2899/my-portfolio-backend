import mongoose from "mongoose";
import {config, mongoUri} from "./index.js"

export const connectMongo = async () => {
  try {
    const uri = mongoUri(config.dbUserName, config.dbPassword, config.dbName, config.dbClusterName, config.dbClusterNameSuffix);
    const { connection } = await mongoose.connect(uri);
    console.log("\n🚀 ~ connectMongo ~ uri:", uri)
    console.log(`\n☘️  MongoDB Connected: ${connection.host}\n`);
  } catch (error) {
    console.log(`ERROR: ${error.message}`);
    process.exit(1);
  }
};