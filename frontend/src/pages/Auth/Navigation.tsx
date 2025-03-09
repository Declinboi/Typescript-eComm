import { useState } from "react";
import "./Navigation.css";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Heart,
  HomeIcon,
  LogInIcon,
  ShoppingBagIcon,
  ShoppingCart,
  User,
  User2Icon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import { RootState } from "../../redux/store";

const Navigation = () => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    // <div className="">
    <div
      style={{ zIndex: 9999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-[#000] w-[5%] hover:w-[15%] h-[100vh]  fixed `}
      id="navigation-container"
    >
      <div className="flex flex-col justify-center space-y-4">
        <Link
          to="/"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <HomeIcon className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">HOME</span>{" "}
        </Link>

        <Link
          to="/shop"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <ShoppingBagIcon className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">SHOP</span>{" "}
        </Link>

        <Link to="/cart" className="flex relative">
          <div className="flex items-center transition-transform transform hover:translate-x-2">
            <ShoppingCart className="mt-[3rem] mr-2" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">Cart</span>{" "}
          </div>

          {/* <div className="absolute top-9">
            {cartItems.length > 0 && (
              <span>
              <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
              {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              </span>
            )}
          </div> */}
        </Link>

        <Link to="/favorite" className="flex relative">
          <div className="flex justify-center items-center transition-transform transform hover:translate-x-2">
            <Heart className="mt-[3rem] mr-2" size={20} />
            <span className="hidden nav-item-name mt-[3rem]">
              Favorites
            </span>{" "}
            {/* <FavoritesCount /> */}
          </div>
        </Link>
      </div>

      <div className="relative ">
        <button
          onClick={toggleDropdown}
          className=" border-2 px-2 bg-gradient-to-r from-green-600 to-emerald-900 rounded-md border-green-900 flex items-center text-gray-800 focus:outline-none"
        >
          <User className="h-5 w-5 mr-2 mt-[4px]" />
          <span className="text-white hidden nav-item-name uppercase">
            {userInfo?.username || "Guest"}
          </span>
          {userInfo && (
            <ChevronDown
              className={`h-4 w-4 text-white ml-1 transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {dropdownOpen && userInfo && (
          <ul
            className={`absolute left-14 mt-2 mr-14 space-y-2 rounded-lg bg-gray-400 text-green-600 ${
              !userInfo.isAdmin ? "-top-20" : "-top-80"
            } `}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 hover:rounded-lg hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/productlist"
                    className="block px-4 py-2 hover:rounded-lg hover:bg-gray-100"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/categorylist"
                    className="block px-4 py-2 hover:rounded-lg hover:bg-gray-100"
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/orderlist"
                    className="block px-4 py-2 hover:rounded-lg hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/userlist"
                    className="block px-4 py-2 hover:rounded-lg hover:bg-gray-100"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link
                to="/profile"
                className="block px-4 py-2 hover:rounded-lg hover:bg-gray-100"
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="block w-full px-4 py-2 text-left hover:rounded-lg hover:bg-gray-100"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
        {!userInfo && (
          <ul>
            <li>
              <Link
                to="/login"
                className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
              >
                <LogInIcon className="mr-2 mt-[4px]" size={26} />
                <span className="hidden nav-item-name">LOGIN</span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
              >
                <User2Icon size={26} />
                <span className="hidden nav-item-name">REGISTER</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
    // </div>
  );
};

export default Navigation;
