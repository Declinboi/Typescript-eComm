import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ElementType;
  label?: string;
}

const Input: React.FC<InputProps> = ({ icon: Icon, label, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <label className="block">
      {label && <p className="font-medium text-[14px] mb-1">{label}</p>}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon className="size-5 text-green-500" />
          </div>
        )}
        <input
          {...props}
          type={isPassword && !showPassword ? "password" : "text"} // Toggle type
          className="w-full pl-10 pr-10 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-green-500"
          >
            {showPassword ? (
              <EyeOffIcon className="size-5" />
            ) : (
              <EyeIcon className="size-5" />
            )}
          </button>
        )}
      </div>
    </label>
  );
};

export default Input;
