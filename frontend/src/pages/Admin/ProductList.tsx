import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import Input from "../../components/Input";
import { Category } from "./CategoryList";

const ProductList = () => {
  const [image, setImage] = useState<any>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [stock, setStock] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<any>(null);

  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      if (image) productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price.toString());
      productData.append("category", category);
      productData.append("quantity", quantity.toString());
      productData.append("brand", brand);
      productData.append("countInStock", stock.toString());

      for (const [key, value] of productData.entries()) {
        console.log(`${key}:`, value);
      }

      const { data } = await createProduct(productData).unwrap();
      if (data?.error) {
        toast.error("Product creation failed. Try again.");
      } else {
        toast.success(` Product is created`);
        navigate("/");
      }
    } catch (error: any) {
      console.error("Error submitting product:", error);
      toast.error("Product creation failed. Try again.");
    }
  };

  // Handle image upload
  const uploadFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      console.log("Upload Response:", res);
      toast.success(res.message);
      setImage(file);
      setImageUrl(res.image);
    } catch (error: any) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 p-4">
          <AdminMenu />
        </div>

        {/* Main Form Area */}
        <div className="w-full md:w-3/4 p-4">
          <h2 className="text-3xl font-bold mb-6">Create Product</h2>

          {imageUrl && (
            <div className="text-center mb-4">
              <img
                src={imageUrl}
                alt="Product Preview"
                className="block mx-auto max-h-[200px] rounded-lg shadow-md"
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-700 rounded-lg p-10 cursor-pointer bg-white font-bold text-center text-black hover:bg-emerald-50 transition">
                {image ? image.name : "Click to Upload Image"}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="hidden"
                />
              </label>
            </div>

            {/* Name & Price */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block mb-1 font-medium">Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block mb-1 font-medium">Price</label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Quantity & Brand */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block mb-1 font-medium">Quantity</label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block mb-1 font-medium">Brand</label>
                <Input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                className="w-full p-3 rounded-lg bg-[#101011] text-white border"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Stock & Category */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block mb-1 font-medium">Count In Stock</label>
                <Input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block mb-1 font-medium">Category</label>
                <select
                  className="w-full p-3 rounded-lg bg-[#101011] text-white border"
                  onChange={(e) => setCategory(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Choose Category
                  </option>
                  {categories?.map((c: Category) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-right">
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-emerald-800 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
