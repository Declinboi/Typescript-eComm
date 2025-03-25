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
          element: <PrivateRoute />,
          children: [
            // Protected routes in a wrapper

            { path: "/profile", element: <Profile /> },
            // { path: "/contact", element: <Contact /> },
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
      <AppRouter />
    </Provider>
  </StrictMode>
);
