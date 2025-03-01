import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { useProfileMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import { RootState } from "../../redux/store";
import Input from "../../components/Input";
import { Loader, Lock, Mail, User } from "lucide-react";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Prevent API call if nothing has changed
    if (
      username === userInfo?.username &&
      email === userInfo?.email &&
      password === ""
    ) {
      toast.info("No changes detected");
      return;
    }

    try {
      const res = await updateProfile({
        _id: userInfo?._id,
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
      }).unwrap();

      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "data" in err) {
        toast.error(
          (err as { data?: { message?: string } }).data?.message ||
            "An error occurred. Please try again."
        );
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4 mt-[10rem]">
      <div className="flex justify-center align-center md:flex md:space-x-4">
        <div className="md:w-1/3">
          <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <Input
                label="Username"
                icon={User}
                type="text"
                placeholder="Name"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
              <Input
                label="Email Address"
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Enter Password"
                icon={Lock}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                label="Confiirm Password"
                icon={Lock}
                type="password"
                placeholder="ConfiirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="flex bg-green-600 text-white py-2 px-4 rounded hover:bg-emerald-700"
              >
                Update
                {loadingUpdateProfile && (
                  <Loader className="w-5 h-5 animate-spin text-white ml-2" />
                )}
              </button>

              <Link
                to="/user-orders"
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-emerald-700"
              >
                My Orders
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
