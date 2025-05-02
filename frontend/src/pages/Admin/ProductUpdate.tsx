import { useState, useEffect, ChangeEvent } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import Input from "../../components/Input";

const ProductUpdate = () => {
  const params = useParams();

  const { data: productData } = useGetProductByIdQuery(params._id);

  console.log(productData);

  const [image, setImage] = useState(productData?.image || "");
  const [imageUrl, setImageUrl] = useState(productData?.imageUrl || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock);

  // hook
  const navigate = useNavigate();

  // Fetch categories using RTK Query
  const { data: categories } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();

  // Define the update product mutation
  const [updateProduct] = useUpdateProductMutation();

  // Define the delete product mutation
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData?.image);
      setImageUrl(productData?.imageUrl);
    }
  }, [productData]);

  const uploadFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      console.log("Upload Response:", res);
      toast.success("Image added successfully");
      setImage(file);
      setImageUrl(res.image);
    } catch (err) {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price.toString());
      formData.append("category", category);
      formData.append("quantity", quantity.toString());
      formData.append("brand", brand);
      formData.append("countInStock", stock.toString());

      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      // Update product using the RTK Query mutation
      const data = await updateProduct({
        productId: params._id,
        formData,
      }).unwrap();

      if (data?.error) {
        toast.error("Product update failed. Try again.");
      } else {
        toast.success("Product successfully updated");
        navigate("/allproducts");
      }
    } catch (err) {
      console.log(err);
      toast.error("Product update failed. Try again.");
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      const { data } = await deleteProduct(params._id).unwrap();
      console.log(data);
      toast.success("Product was deleted");
      navigate("/allproducts");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed. Try again.");
    }
  };

  return (
    <>
      <div className="container xl:mx-[9rem] sm:mx-0">
        <div className="flex flex-col md:flex-row">
          <AdminMenu />
          <div className="md:w-3/4 p-5">
            <h2 className="text-4xl font-bold mb-6">Update / Delete Product</h2>

            {imageUrl && (
              <div className="text-center mb-5">
                <img
                  src={imageUrl}
                  alt="product"
                  className="mx-auto max-h-[200px] rounded-md shadow"
                />
              </div>
            )}

            <div className="mb-5">
              <label className="border border-dashed border-emerald-800 text-black bg-white px-4 block w-full text-center rounded-lg cursor-pointer font-semibold py-10 hover:bg-emerald-100 transition duration-200">
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

            <div className="space-y-6">
              <div className="flex flex-wrap gap-6">
                <div className="flex-1 min-w-[200px]">
                  <label htmlFor="name" className="block font-semibold mb-1">
                    Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label htmlFor="price" className="block font-semibold mb-1">
                    Price
                  </label>
                  <Input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex-1 min-w-[200px]">
                  <label
                    htmlFor="quantity"
                    className="block font-semibold mb-1"
                  >
                    Quantity
                  </label>
                  <Input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label htmlFor="brand" className="block font-semibold mb-1">
                    Brand
                  </label>
                  <Input
                    type="text"
                    id="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block font-semibold mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  className="w-full p-3 bg-[#101011] text-white border rounded-lg"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                ></textarea>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex-1 min-w-[200px]">
                  <label htmlFor="stock" className="block font-semibold mb-1">
                    Count In Stock
                  </label>
                  <Input
                    type="number"
                    id="stock"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                  />
                </div>

                <div className="flex-1 min-w-[300px]">
                  <label
                    htmlFor="category"
                    className="block font-semibold mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    className="w-full p-3 bg-[#101011] text-white border rounded-lg"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                  >
                    <option value="" disabled>
                      Choose Category
                    </option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 rounded-lg text-white font-bold bg-green-600 hover:bg-green-700 transition"
                >
                  Update
                </button>
                <button
                  onClick={handleDelete}
                  className="px-8 py-3 rounded-lg text-white font-bold bg-red-600 hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductUpdate;
