import mongoose from "mongoose"; 

export const connectDB = async () => {
    try {
       const conn= await mongoose.connect(process.env.MONGO_DB)
console.log(`Successfully connected to mongoDB:  ${conn.connection.host}`)

    } catch (error) {
        console.error("error:", error.message)
        process.exit(1)
    }
}

