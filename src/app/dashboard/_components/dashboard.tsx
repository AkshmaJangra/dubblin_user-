"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

// Icons
import {
  User,
  Home,
  MapPin,
  Clock,
  LogOut,
  ChevronRight,
  Eye,
  ShoppingBag,
  Settings,
} from "lucide-react";

interface UserInfoProps {
  userInfo: any;
  recentOrders: any;
  session: any;
  AddressInfo: [];
}

const Dashboard: React.FC<UserInfoProps> = (props) => {
  const router = useRouter();
  const { userInfo, recentOrders, session, AddressInfo } = props;
  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
  }, [userInfo]);

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false,
      });
      router.push("/");
      toast.success("Logged out successfully");
      router.refresh();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleResetPassword = () => {
    router.push(`/reset-password?id=${userInfo?._id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const menuItems = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      href: "/dashboard",
      active: true,
    },
    {
      icon: <User size={20} />,
      label: "Personal Info",
      href: "/personal-info",
    },
    { icon: <MapPin size={20} />, label: "Addresses", href: "/address" },
    {
      icon: <Clock size={20} />,
      label: "Order History",
      href: "/order-history",
    },
  ];

  const userStats = [
    {
      label: "Orders",
      value: recentOrders?.length || 0,
      icon: <ShoppingBag className="text-pink-500" size={24} />,
    },
    {
      label: "Saved Addresses",
      value: AddressInfo?.length || 0,
      icon: <MapPin className="text-amber-500" size={24} />,
    },
  ];

  return (
    <div className="font-Outfit bg-gray-50 min-h-screen">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-pink-900 to-pink-500 py-24 px-6 relative overflow-hidden">
        <div className="container mx-auto flex items-center justify-between relative z-10">
          <div className="text-white">
            <h1 className="text-3xl font-bold">
              Welcome back, {userInfo?.name} {userInfo?.last_name}
            </h1>
            <p className="text-indigo-100 mt-2">
              Manage your account and orders here
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
              {userInfo?.profile_image || session?.user?.image ? (
                <img
                  src={userInfo.profile_image || session?.user?.image}
                  alt="Profile"
                  className="h-12 w-12 md:h-20 md:w-20 rounded-full object-cover"
                />
              ) : (
                <User size={32} className="text-white" />
              )}
            </div>
          </div>
        </div>
        {/* Abstract shapes for visual appeal */}
        <div className="absolute -bottom-8 left-0 w-full h-32 bg-gray-50 rounded-t-[50%] transform translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full -mr-32 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/20 rounded-full -ml-20 -mb-20"></div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 relative -mt-12">
        <div className="lg:flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block lg:w-1/5 sticky top-16 h-fit">
            <div className="bg-white shadow-sm rounded-xl p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                My Account
              </h2>
              <nav>
                <ul className="space-y-1">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link href={item.href}>
                        <div
                          className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                            item.active
                              ? "bg-pink-50 text-pink-700"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={
                                item.active ? "text-pink-600" : "text-gray-500"
                              }
                            >
                              {item.icon}
                            </span>
                            <span className="font-medium">{item.label}</span>
                          </div>
                          {item.active && (
                            <ChevronRight size={16} className="text-pink-600" />
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                  <li className="pt-4 mt-4 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Log Out</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>

          {/* Main Dashboard Content */}
          <div className="flex-1 space-y-6 mb-10">
            {/* Mobile Navigation */}
            <div className="lg:hidden bg-white shadow-sm rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userStats?.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        {stat?.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        {stat?.value}
                      </p>
                    </div>
                    <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gray-50">
                      {stat?.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Account Details
                </h3>
                {session?.user?.image?.includes("lh3.googleusercontent.com")
                  ? null
                  : // <button
                    //   onClick={handleResetPassword}
                    //   className="text-pink-600 font-medium flex items-center hover:text-pink-800 text-sm"
                    // >
                    //   <Settings size={16} className="mr-1" /> Update Password
                    // </button>
                    ""}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Full Name</p>
                    <p className="font-medium text-gray-800">
                      {userInfo?.name} {userInfo?.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Email Address</p>
                    <p className="font-medium text-gray-800">
                      {userInfo?.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Phone Number</p>
                    <p className="font-medium text-gray-800">
                      {userInfo?.phone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Member Since</p>
                    <p className="font-medium text-gray-800">
                      {userInfo?.createdAt
                        ? formatDate(userInfo?.createdAt)
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Recent Orders
                </h3>
                {recentOrders?.length > 0 && (
                  <Link href="/order-history">
                    <div className="text-pink-600 font-medium flex items-center hover:text-pink-800 text-sm">
                      View All <ChevronRight size={16} />
                    </div>
                  </Link>
                )}
              </div>

              {recentOrders?.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag
                    size={48}
                    className="mx-auto text-gray-300 mb-4"
                  />
                  <h4 className="text-lg font-medium text-gray-700">
                    No orders yet
                  </h4>
                  <p className="text-gray-500 mt-1">
                    Start shopping to see your orders here
                  </p>
                  <Link href="/shop">
                    <div className="mt-4 inline-block px-5 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors">
                      Browse Products
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="pb-3 font-medium">Order ID</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium sr-only">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {recentOrders?.slice(0, 5).map((order: any) => (
                        <tr key={order?._id} className="hover:bg-gray-50">
                          <td className="py-4 font-medium text-gray-800">
                            {order?.orderId}
                          </td>
                          <td className="py-4 text-gray-600">
                            {formatDate(order?.createdAt)}
                          </td>
                          <td className="py-4 font-medium text-gray-800">
                            {formatCurrency(order?.paidAmount)}
                          </td>
                          <td className="py-4">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full border capitalize ${getStatusColor(
                                order?.status
                              )}`}
                            >
                              {order?.status}
                            </span>
                          </td>
                          {order?.status.trim() === "success" && (
                            <td className="py-4 text-right">
                              <button
                                onClick={() =>
                                  router.push(
                                    `/order-history/${order?.orderId}`
                                  )
                                }
                                className="text-gray-500 hover:text-pink-600 transition-colors"
                              >
                                <Eye size={18} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
