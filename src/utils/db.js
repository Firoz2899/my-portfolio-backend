import mongoose from "mongoose";
import {config, mongoUri} from "./index.js"

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

export const connectMongo = async () => {
  try {
    const uri = mongoUri(config.dbUserName, config.dbPassword, config.dbName, config.dbClusterName, config.dbClusterNameSuffix);
    console.log("🚀 ~ db.js:9 ~ connectMongo ~ uri:", uri);
    const { connection } = await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    // console.log("\n🚀 ~ connectMongo ~ uri:", uri)
    console.log(`\n☘️  MongoDB Connected: ${connection.host}\n`);
  } catch (error) {
    console.log(`ERROR: ${error.message}`);
    process.exit(1);
  }
};