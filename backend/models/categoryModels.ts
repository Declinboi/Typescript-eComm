import mongoose, { Schema, Document } from "mongoose";

// Define an interface for Category
interface ICategory extends Document {
  name: string;
}

// Create the Schema
const categorySchema: Schema<ICategory> = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 32,
    unique: true,
  },
});
const Category = mongoose.model<ICategory>("Category", categorySchema);

// Export the Model
export default Category;
