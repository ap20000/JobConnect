import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(null);  // Add state for user count
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsersAndCount = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Unauthorized: No token found");
        setLoading(false);
        return;
      }

      try {
        // Fetch the users
        const usersResponse = await axios.get("http://192.168.1.122:3001/user/usersAll", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersResponse.data);

        // Fetch the total user count
        const countResponse = await axios.get("http://192.168.1.122:3001/user/userCount", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserCount(countResponse.data.userCount);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError("Unauthorized: Invalid or expired token");
        } else {
          setError("Failed to fetch data. Please try again later.");
        }
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndCount();
  }, []);

  const handleDelete = async (userId) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("Unauthorized: No token found");
      return;
    }

    try {
      await axios.delete(`http://192.168.1.122:3001/user/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      setError("Failed to delete user");
      console.error(error);
    }
  };

  return (
    <div className="user-details p-4">
      <h2 className="text-2xl font-bold">User Details</h2>
      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div>
          {/* Display total user count */}
          {userCount !== null && (
            <p className="text-lg font-semibold mb-4">Total Users: {userCount}</p>
          )}

          {/* Display user details */}
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.role}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
