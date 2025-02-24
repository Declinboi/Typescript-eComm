import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGO_DB) {
      throw new Error(
        "MONGO_DB connection string is not defined in environment variables."
      );
    }

    const conn = await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    console.log(`Successfully connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error:", (error as Error).message);
    process.exit(1);
  }
};
export default connectDB;
