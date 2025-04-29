import Input from "./Input";

interface CategoryFormProps {
  value: string;
  setValue: (value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  buttonText?: string;
  handleDelete?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="space-y-3 ">
        <Input
          type="text"
          placeholder="Write category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="flex  justify-between">
          <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 foucs:ring-pink-500 focus:ring-opacity-50">
            {buttonText}
          </button>

          {handleDelete && (
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 foucs:ring-red-500 focus:ring-opacity-50"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
