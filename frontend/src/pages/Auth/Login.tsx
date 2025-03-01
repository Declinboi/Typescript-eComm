import React, { useEffect, useState } from "react";
import { useLoginMutation } from "../../redux/api/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { RootState } from "../../redux/store";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Input from "../../components/Input";
import { Loader, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      console.log(res);
      dispatch(setCredentials(res)); // No need to spread `res`
      navigate(redirect);
      toast.success("User successfully login");
    } catch (err: any) {
      toast.error(err?.data?.message || err.message || "Something went wrong");
    }
  };

  return (
    <div>
      <div className="pl-[10rem] flex flex-wrap ">
        <div className="mr-[4rem] mt-[5rem]">
          <h1 className="text-2xl font-semibold mb-4">Sign In</h1>

          <form
            onSubmit={submitHandler}
            className="container w-[20rem] sm:w-[40rem]"
          >
            <Input
              label="Email Address"
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex items-center mb-6 justify-between">
              <Link
                to="/forgot-password"
                className="text-sm text-green-900 hover:underline"
              >
                Forgot password?
              </Link>
              <p className="text-black ">
                New Customer?{" "}
                <Link
                  to={redirect ? `/register?redirect=${redirect}` : "/register"}
                  className="text-green-900 hover:underline"
                >
                  Register
                </Link>
              </p>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="bg-green-900 text-white px-4 py-2 relative rounded cursor-pointer my-4 flex items-center justify-center"
            >
              {isLoading ? "Signing In..." : "Sign In"}
              {isLoading && (
                <Loader className="w-5 h-5 animate-spin text-white ml-2" />
              )}
            </button>
          </form>
        </div>
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
          alt=""
          className="h-[50%] w-[50%] xl:block md:hidden sm:hidden rounded-lg"
        />
      </div>
    </div>
  );
};

export default Login;
