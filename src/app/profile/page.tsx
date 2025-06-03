"use client";
import React, { useState } from "react";
import Image from "next/image";
import { MdOutlineDashboard } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { GrDocumentTime } from "react-icons/gr";

// Dashboard Component
const Dashboard = () => {
  const dashboardItems = [
    { title: "Lorem Ipsum", image: "/dash1.png" },
    { title: "Lorem Ipsum", image: "/dash2.png" },
    { title: "Lorem Ipsum", image: "/dash3.png" },
  ];
  return (
    <div className="flex flex-col w-full py-4 p-4 lg:p-0">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl text-black">Dashboard</h2>
        <button className="text-black">LOG OUT</button>
      </div>

      {/* Dashboard Cards */}
      <div className="flex md:flex-row flex-col gap-6 mb-8">
        {dashboardItems.map((item, index) => (
          <div
            key={index}
            className="md:w-1/3 w-full h-52 flex items-end justify-center rounded-md"
            style={{
              backgroundImage: `url(${item.image})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <p className="text-4xl font-bold mb-6">Lorem Ipsum</p>
          </div>
        ))}
      </div>

      {/* Account Details Section */}
      <div className="flex flex-col gap-4">
        <div className="bg-gray-100 md:w-1/2 w-full shadow-md rounded-md p-6">
          <h3 className="text-xl text-black font-semibold mb-4">
            Account Details
          </h3>
          <div className="flex justify-between">
            <div className="space-y-3">
              <p className="text-gray-700">Yash</p>
              <p className="text-gray-700">yash@example.com</p>
              <button className="text-black hover:underline">
                Reset password
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-gray-700">Rajput</p>
              <p className="text-gray-700">United States</p>
              <p className="text-gray-700">View Address</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 md:w-1/2 w-full shadow-md rounded-md p-6">
          <h3 className="text-xl text-black font-semibold mb-4">
            Most Recent Order
          </h3>
          <p className="text-gray-700">You haven't placed any orders yet.</p>
        </div>
      </div>
    </div>
  );
};

// PersonalInfo Component
const PersonalInfo = () => {
  return (
    <div className="w-full mt-5 p-4 lg:p-0">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl text-black">Personal Info</h2>
        <button className="text-black">LOG OUT</button>
      </div>
      <div className="bg-gray-100 md:w-1/2 w-full shadow-md rounded-md p-6">
        <h3 className="text-xl text-black font-semibold mb-4">
          Account Details
        </h3>
        <div className="flex justify-between">
          <div className="space-y-3">
            <p className="text-gray-700">Yash</p>
            <p className="text-gray-700">yash@example.com</p>
            <button className="text-black hover:underline">
              Reset password
            </button>
          </div>
          <div className="space-y-3">
            <p className="text-gray-700">Rajput</p>
            <p className="text-gray-700">United States</p>
            <p className="text-gray-700">View Address</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// EditAddress Component
const EditAddress = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    country: "United States",
    province: "Alabama",
    postalCode: "",
    phone: "",
    isDefault: false,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUpdate = () => {
    console.log("Updated Address:", formData);
  };

  const handleCancel = () => {
    console.log("Cancelled");
  };

  return (
    <div className="w-full mt-5 p-4 lg:p-0">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl text-black">Personal Info</h2>
        <button className="text-black">LOG OUT</button>
      </div>

      <div className="md:w-1/2 w-full bg-slate-50 px-6 py-2 rounded-md">
        <div className="space-y-3">
          <p className="text-gray-500 text-md">Default</p>
          <p className="text-md text-gray-500">Lalit Joshi</p>
          <p className="text-gray-600 text-md">United States</p>
        </div>
        <div className="flex justify-between mb-6 mt-5 w-1/3">
          <button className="bg-black text-white py-1 text-sm px-5 rounded-sm">
            Edit
          </button>
          <button className="bg-red-500 text-white text-sm py-1 px-3 rounded-sm">
            Delete
          </button>
        </div>
        <form>
          <h3 className="text-lg text-black font-medium mb-4">Edit Address</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className=" text-black text-md">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="border p-2 mt-2 rounded-md w-full"
              />
            </div>
            <div>
              <label className=" text-black text-md">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="border p-2 rounded-md w-full mt-2"
              />
            </div>
            <div>
              <label className=" text-black text-md">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="border p-2 rounded-md w-full mt-2"
              />
            </div>
            <div>
              <label className=" text-black text-md">Address 1</label>
              <input
                type="text"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                className="border p-2 rounded-md w-full mt-2"
              />
            </div>
            <div>
              <label className=" text-black text-md">Address 2</label>
              <input
                type="text"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                className="border p-2 rounded-md w-full mt-2"
              />
            </div>
            <div>
              <label className=" text-black text-md">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="border p-2 rounded-md w-full mt-2"
              />
            </div>
            <div>
              <label className=" text-black"> Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="border p-2 rounded-md w-full"
              >
                <option value="United States">United States</option>
                {/* Add other countries as needed */}
              </select>
            </div>
            <div>
              <label className=" text-black"> Province</label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="border p-2 rounded-md w-full"
              >
                <option value="Alabama">Alabama</option>
                {/* Add other provinces as needed */}
              </select>
            </div>
            <input
              type="text"
              name="postalCode"
              placeholder="Postal/Zip Code"
              value={formData.postalCode}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <label htmlFor="isDefault" className="text-sm">
                Set as default address
              </label>
            </div>
          </div>
          <div className="flex mt-6 gap-4">
            <button
              type="button"
              onClick={handleUpdate}
              className="bg-black text-white px-4 py-2 rounded-sm"
            >
              Update Address
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 px-4 py-2 rounded-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// OrderHistory Component
const OrderHistory = () => {
  return (
    <div className="w-full mt-5 p-4 lg:p-0">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl text-black">Order History</h2>
        <button className="text-black">LOG OUT</button>
      </div>
      <div className="md:w-1/2 w-full bg-gray-100 rounded-md h-[50vh] p-4">
        <p className="text-black">You haven't placed any orders yet.</p>
      </div>
    </div>
  );
};

// Main Page Component
const Page = () => {
  const [component, setComponent] = useState(<Dashboard />);

  const handleDashboard = () => setComponent(<Dashboard />);
  const handlePersonalInfo = () => setComponent(<PersonalInfo />);
  const handleAddress = () => setComponent(<EditAddress />);
  const handleOrders = () => setComponent(<OrderHistory />);

  return (
    <div className="font-Outfit">
      {/* Header Section */}
      <header
        style={{ backgroundImage: "url('/profiletop.png')" }}
        className="p-32 bg-cover bg-center"
      ></header>

      {/* Main Content */}
      <main className="container mx-auto mt-5">
        <div className="lg:flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:w-1/6 bg-white p-4">
            <h2 className="text-2xl text-black mb-4">My Account</h2>
            <nav>
              <ul className="space-y-2">
                <li
                  className="text-gray-700 font-medium hover:bg-gray-300 p-1 rounded-md flex items-center gap-4 cursor-pointer"
                  onClick={handleDashboard}
                >
                  <MdOutlineDashboard className="text-xl" /> Dashboard
                </li>
                <li
                  className="text-gray-700 hover:bg-gray-300 p-1 rounded-md flex items-center gap-4 cursor-pointer"
                  onClick={handlePersonalInfo}
                >
                  <CiUser className="text-xl" /> Personal Info
                </li>
                <li
                  className="text-gray-700 hover:bg-gray-300 p-1 rounded-md flex items-center gap-4 cursor-pointer"
                  onClick={handleAddress}
                >
                  <IoLocationOutline className="text-xl" /> Addresses
                </li>
                <li
                  className="text-gray-700 hover:bg-gray-300 p-1 rounded-md flex items-center gap-4 cursor-pointer"
                  onClick={handleOrders}
                >
                  <GrDocumentTime className="text-xl" /> Order History
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Dashboard Section */}
          {component}
        </div>
      </main>

      <div
        style={{ backgroundImage: "url('/profilebottom.png')" }}
        className="h-[80vh] mt-8 flex items-end bg-cover bg-center"
      >
        <p className="font-bold text-5xl w-1/2 mb-32 ml-20 text-white">
          Lorem Ipsum is simply dummy text of the printing
        </p>
      </div>
    </div>
  );
};

export default Page;
export const dynamic = "force-dynamic";
