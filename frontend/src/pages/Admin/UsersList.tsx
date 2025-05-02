import { useEffect, useState } from "react";
import { Check, Edit, Loader, Trash, X } from "lucide-react";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/userApiSlice";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Input from "../../components/Input";
import AdminMenu from "./AdminMenu";

export interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

const UserList: React.FC = () => {
  const { data: users = [], refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState<string | null>(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteUser(id).unwrap();
        refetch();
      } catch (err: any) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id: string, username: string, email: string) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id: string) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      }).unwrap();
      setEditableUserId(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl text-center font-semibold mb-4">Users List</h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">
          {(error as { data?: { message?: string }; error?: string })?.data
            ?.message || (error as { error?: string })?.error}
        </Message>
      ) : (
        <div className="flex flex-col md:flex-row">
          <AdminMenu />

          <div className="overflow-x-auto w-full md:w-4/5 mx-auto">
            <table className="w-full border border-gray-300 shadow-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">NAME</th>
                  <th className="px-4 py-3">EMAIL</th>
                  <th className="px-4 py-3">ADMIN</th>
                  <th className="px-4 py-3 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-4 py-2">{user._id}</td>

                    {/* Username Cell */}
                    <td className="px-4 py-2">
                      {editableUserId === user._id ? (
                        <div className="flex items-center">
                          <Input
                            type="text"
                            value={editableUserName}
                            onChange={(e) =>
                              setEditableUserName(e.target.value)
                            }
                            className="w-full"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="ml-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"
                            aria-label="Save Username"
                          >
                            <Check />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {user.username}
                          <button
                            onClick={() =>
                              toggleEdit(user._id, user.username, user.email)
                            }
                            className="ml-3 text-blue-500"
                            aria-label="Edit Username"
                          >
                            <Edit />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Email Cell */}
                    <td className="px-4 py-2">
                      {editableUserId === user._id ? (
                        <div className="flex items-center">
                          <Input
                            type="text"
                            value={editableUserEmail}
                            onChange={(e) =>
                              setEditableUserEmail(e.target.value)
                            }
                            className="w-full"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="ml-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"
                            aria-label="Save Email"
                          >
                            <Check />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <a
                            href={`mailto:${user.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {user.email}
                          </a>
                          <button
                            onClick={() =>
                              toggleEdit(user._id, user.username, user.email)
                            }
                            className="ml-3 text-blue-500"
                            aria-label="Edit Email"
                          >
                            <Edit />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Admin Status */}
                    <td className="px-4 py-2">
                      {user.isAdmin ? (
                        <Check className="text-green-600" />
                      ) : (
                        <X className="text-red-600" />
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-2 text-center">
                      {!user.isAdmin && (
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          aria-label="Delete User"
                        >
                          <Trash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
