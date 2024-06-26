// UserProfile.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SideBarClient from "../components/SideBarClient";

const UserProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://brotein-bistro-01am.onrender.com/api/active/subs/users/${id}/meals`
        );

        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data[0]);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError(error.message);
      }
    };

    fetchData();
  }, [id]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-login">
        Error: {error}
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen bg-login">
        Loading...
      </div>
    );
  }

  return (
    <div className="grid md:grid-flow-col lg:grid-flow-col ">
      <SideBarClient />
      <div className="flex items-center justify-center min-h-screen pt-20 p-2 w-full md:col-span-12">
        <div className="text-center  glass shadow-lg p-6 rounded-2xl  border overflow-hidden">
          <h1 className="text-xl font-bold mb-4">User Profile</h1>
          <table className="w-full text-left mt-8">
            <thead className="rounded-2xl">
              <tr className="bg-[#F6F6F6] rounded-2xl">
                <th className="px-4 py-2 font-semibold text-sm text-gray-500 border-b border">
                  Details
                </th>
                <th className="px-4 py-2 font-semibold text-sm text-gray-500 border-b border">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="rounded-lg">
              <tr className="border-b border hover:bg-[#F6F6F6]">
                <td className="px-4 py-2">ID:</td>
                <td>{userData.userId}</td>
              </tr>
              <tr className="border-b border hover:bg-[#F6F6F6]">
                <td className="px-4 py-2">Username:</td>
                <td>{userData.username}</td>
              </tr>
              <tr className="border-b border hover:bg-[#F6F6F6]">
                <td className="px-4 py-2">Phone Number:</td>
                <td>{userData.phoneNumber}</td>
              </tr>
              <tr className="border-b border hover:bg-[#F6F6F6]">
                <td className="px-4 py-2">Address:</td>
                <td>{userData.address}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
