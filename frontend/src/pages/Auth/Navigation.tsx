import { useState } from "react";
import "./Navigation.css";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Heart,
  HomeIcon,
  LogInIcon,
  Menu,
  ShoppingBagIcon,
  ShoppingCart,
  User,
  User2Icon,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import { RootState } from "../../redux/store";
import FavoritesCount from "../Products/FavoriteCount";

const Navigation = () => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const cart = useSelector((state: RootState) => state.cart);
  const { cartItems } = cart;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
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
    <>
      {/* Hamburger Button (visible on small screens) */}
      <button
        onClick={toggleSidebar}
        className="fixed top-0 left-2 z-99999 p-2 bg-black text-white text-sm rounded-md shadow-lg md:hidden "
      >
        {showSidebar ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 z-[9999] h-full w-[75%] bg-black text-white p-6 transition-transform duration-300 md:hidden ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col space-y-6 mt-4">
          <Link to="/" onClick={toggleSidebar} className="flex items-center">
            <HomeIcon className="mr-2" />
            <span>HOME</span>
          </Link>

          <Link
            to="/shop"
            onClick={toggleSidebar}
            className="flex items-center"
          >
            <ShoppingBagIcon className="mr-2" />
            <span>SHOP</span>
          </Link>

          <Link
            to="/cart"
            onClick={toggleSidebar}
            className="flex items-center relative"
          >
            <ShoppingCart className="mr-2" />
            <span>CART</span>
            {cartItems.length > 0 && (
              <span className="ml-auto bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cartItems.reduce((a: any, c: any) => a + c.qty, 0)}
              </span>
            )}
          </Link>

          <Link
            to="/favorite"
            onClick={toggleSidebar}
            className="flex items-center relative"
          >
            <Heart className="mr-2" />
            <span>FAVORITES</span>
            <FavoritesCount />
          </Link>

          {userInfo ? (
            <>
              <Link
                to="/profile"
                onClick={toggleSidebar}
                className="flex items-center"
              >
                <User className="mr-2" />
                <span>PROFILE</span>
              </Link>
              {userInfo.isAdmin && (
                <>
                  <Link to="/admin-dashboard" onClick={toggleSidebar}>
                    Dashboard
                  </Link>
                  <Link to="/productlist" onClick={toggleSidebar}>
                    Products
                  </Link>
                  <Link to="/categorylist" onClick={toggleSidebar}>
                    Category
                  </Link>
                  <Link to="/orderlist" onClick={toggleSidebar}>
                    Orders
                  </Link>
                  <Link to="/userlist" onClick={toggleSidebar}>
                    Users
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  logoutHandler();
                  toggleSidebar();
                }}
                className="text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={toggleSidebar}
                className="flex items-center"
              >
                <LogInIcon className="mr-2" />
                <span>LOGIN</span>
              </Link>
              <Link
                to="/register"
                onClick={toggleSidebar}
                className="flex items-center"
              >
                <User2Icon className="mr-2" />
                <span>REGISTER</span>
              </Link>
            </>
          )}
        </div>
      </div>

      <div
        style={{ zIndex: 9999 }}
        className={`${
          showSidebar ? "hidden" : "flex"
        } xl:flex lg:flex hidden sm:hidden flex-col justify-between p-4 text-white bg-[#000] w-[5%] hover:w-[15%] h-[100vh]  fixed `}
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

            <div className="absolute top-9">
              {cartItems.length > 0 && (
                <span>
                  <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                    {cartItems.reduce((a: any, c: any) => a + c.qty, 0)}
                  </span>
                </span>
              )}
            </div>
          </Link>

          <Link to="/favorite" className="flex relative">
            <div className="flex justify-center items-center transition-transform transform hover:translate-x-2">
              <Heart className="mt-[3rem] mr-2" size={20} />
              <span className="hidden nav-item-name mt-[3rem]">Favorites</span>
              <FavoritesCount />
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
              className={`absolute left-14 mt-2 mr-14 space-y-2 rounded-lg bg-white text-green-600 ${
                !userInfo.isAdmin ? "-top-20" : "-top-80"
              } `}
            >
              {userInfo.isAdmin && (
                <>
                  <li>
                    <Link
                      to="/admin-dashboard"
                      className="block px-4 py-2 hover:rounded-lg  hover:bg-gray-100"
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
    </>
  );
};

export default Navigation;
