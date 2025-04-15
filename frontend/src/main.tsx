import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Home from "./pages/Home.tsx";
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import Login from "./pages/Auth/Login.tsx";
import Register from "./pages/Auth/Register.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import Profile from "./pages/User/Profile.tsx";
import AdminRoutes from "./pages/Admin/AdminRoutes.tsx";
import UserList from "./pages/Admin/UsersList.tsx";
import CategoryList from "./pages/Admin/CategoryList.tsx";
import ProductList from "./pages/Admin/ProductList.tsx";
import ProductUpdate from "./pages/Admin/ProductUpdate.tsx";
import AllProducts from "./pages/Admin/AllProducts.tsx";
import FavouritePage from "./pages/Products/FavoritePage.tsx";
import ProductDetails from "./pages/Products/ProductDetails.tsx";
import Cart from "./pages/Cart.tsx";
import Shop from "./Shop.tsx";
import Shipping from "./pages/Orders/Shipping.tsx";
import PlaceOrder from "./pages/Orders/PlaceOrder.tsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import OrderPage from "./pages/Orders/OrderPage.tsx";
import UserOrders from "./pages/User/UserOrders.tsx";
import OrderList from "./pages/Admin/OrderList.tsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.tsx";

// const initialOptions = {
  // "clientId": import.meta.env.PAYPAL_CLIENT_ID
// };

function AppRouter() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/favorite",
          element: <FavouritePage />,
        },
        {
          path: "/product-details/:id",
          element: <ProductDetails />,
        },
        {
          path: "/cart",
          element: <Cart />,
        },
        {
          path: "/shop",
          element: <Shop />,
        },
        {
          element: <PrivateRoute />,
          children: [
            // Protected routes in a wrapper

            { path: "/profile", element: <Profile /> },
            { path: "/shipping", element: <Shipping /> },
            { path: "/placeorder", element: <PlaceOrder /> },
            { path: "/order/:id", element: <OrderPage /> },
            { path: "/user-orders", element: <UserOrders /> },
          ],
        },

        {
          element: <AdminRoutes />,
          children: [
            // Protected routes in a wrapper

            { path: "/userlist", element: <UserList /> },
            { path: "/categorylist", element: <CategoryList /> },
            { path: "/productlist/:pageNumber", element: <ProductList /> },
            { path: "/productupdate/:_id", element: <ProductUpdate /> },
            { path: "/allproducts", element: <AllProducts /> },
            { path: "/orderlist", element: <OrderList /> },
            { path: "/admin-dashboard", element: <AdminDashboard /> },

          ],
        },

        {
          path: "/login",
          element: <Login />,
        },

        {
          path: "/Register",
          element: <Register />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider   options={{
        clientId:paypalData.clientId, // from your backend
        currency: "USD",
      }}>
      <AppRouter />
      </PayPalScriptProvider>
    </Provider>
  </StrictMode>
);
