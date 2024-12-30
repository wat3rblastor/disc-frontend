'use client'

import Image from "next/image";
import { useState } from 'react';

export default function Home() {
  const [resData, setResData] = useState("Waiting for an action...");
  const [httpReq, setHttpReq] = useState("GET");
  const [userInfo, setUserInfo] = useState({
    "first_name": "",
    "last_name": "",
    "email": "",
    "date_of_birth": ""
  });
  const [userId, setUserId] = useState(0); 

  function handleChange(event) {
    setHttpReq(event.target.value);
    setResData("Waiting for action...");
  } 

  function handlePostChange(event) {
    const { name, value } = event.target;
    setUserInfo({
      ...userInfo,
      [name]: value
    });
  }

  function handleDPChange(event) {
    const { name, value } = event.target;
    setUserId(value);
  }

  async function handleClick() {
    try {
      if (httpReq == "GET") {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users`);
        const res_json = await response.json();
        setResData(res_json);
      }
      else if (httpReq == "POST") {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userInfo)
        });
        const res_json = await response.json();
        setResData(res_json["msg"]);
      }
      else if (httpReq == "DELETE") {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/${userId}`, {
          method: 'DELETE'
        });
        const res_json = await response.json();
        setResData(res_json["msg"]);
      }
      else if (httpReq == "PUT") {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userInfo)
        });
        const res_json = await response.json();
        setResData(res_json["msg"]);
      }
      else {
        throw Error("httpReq error")
      }
    } catch (err) {
      console.log("Error: "+ err);
    }
  }
  
  return(
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Bowen's DISC Project</h1>
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <Dropdown handleChange={handleChange} />
        {(httpReq === "POST" || httpReq === "PUT") && (
          <PostDropdown handlePostChange={handlePostChange} userInfo={userInfo} />
        )}
        {(httpReq === "DELETE" || httpReq === "PUT") && (
          <DeletePutDropdown handleDPChange={handleDPChange} userId={userId} />
        )}
        <button 
          onClick={handleClick}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full mt-4 hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </div>
      <div className="mt-6 w-full max-w-lg bg-gray-50 p-4 rounded-lg shadow-md">
        {httpReq === "GET" && Array.isArray(resData) ? (
          <div className="overflow-x-auto w-full">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">First Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Last Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Date of Birth</th>
                </tr>
              </thead>
              <tbody>
                {resData.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.first_name}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.last_name}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(user.date_of_birth).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-700">Data: {JSON.stringify(resData)}</p>
        )}
      </div>
    </div>
  );
}

function Dropdown({ handleChange }) {
  return (
    <div className="mb-4">
      <select 
        onChange={handleChange}
        className="w-full border-gray-300 rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-400"
      >
        <option value="GET">Display all users</option>
        <option value="POST">Add a user</option>
        <option value="DELETE">Delete a user</option>
        <option value="PUT">Update a user</option>
      </select>
    </div>
  );
}

function PostDropdown({ handlePostChange, userInfo }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700">First Name</label>
        <input 
          name="first_name"
          value={userInfo.first_name}
          onChange={handlePostChange}
          className="w-full border-gray-300 rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-gray-700">Last Name</label>
        <input 
          name="last_name"
          value={userInfo.last_name}
          onChange={handlePostChange}
          className="w-full border-gray-300 rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-gray-700">Email Address</label>
        <input 
          name="email"
          value={userInfo.email}
          onChange={handlePostChange}
          className="w-full border-gray-300 rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-gray-700">Date of Birth</label>
        <input 
          name="date_of_birth"
          value={userInfo.date_of_birth}
          onChange={handlePostChange}
          className="w-full border-gray-300 rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </div>
  );
}

function DeletePutDropdown({ handleDPChange }) {
  return (
    <div className="mt-4">
      <label className="block text-gray-700">User ID</label>
      <input
        name="id"
        onChange={handleDPChange}
        className="w-full border-gray-300 rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-400"
      />
    </div>
  )
}