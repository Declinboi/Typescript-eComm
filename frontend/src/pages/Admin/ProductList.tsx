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
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className=" font-bold text-4xl h-12">Create Product</div>

          {imageUrl && (
            <div className="text-center">
              <img
                src={imageUrl}
                alt="product"
                className="block mx-auto max-h-[200px]"
              />
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="border border-emerald-950 text-black px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11 ">
                {image ? image.name : "Upload Image"}

                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="text-white"
                />
              </label>
            </div>

            <div className="p-3">
              <div className="flex flex-wrap">
                <div className="one">
                  <label htmlFor="name">Name</label> <br />
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="two ml-10 ">
                  <label htmlFor="name block">Price</label> <br />
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap">
                <div className="one">
                  <label htmlFor="name block">Quantity</label> <br />
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="two ml-10 ">
                  <label htmlFor="name block">Brand</label> <br />
                  <Input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
              </div>

              <label htmlFor="" className="my-5">
                Description
              </label>
              <textarea
            className="p-2 mb-3 bg-[#101011]  border rounded-lg w-[95%] text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>

              <div className="flex justify-between">
                <div>
                  <label htmlFor="name block">Count In Stock</label> <br />
                  <Input
                    type="text"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Category</label> <br />
                  <select
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
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

              <button
                type="submit"
                className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-green-600"
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
