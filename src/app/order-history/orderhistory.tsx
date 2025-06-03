
"use client"
import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, LogOut, User, ChevronRight, Home, MapPin, Clock, Settings, ShoppingBag } from "lucide-react"
import { signOut } from "next-auth/react"
import { toast } from "sonner"

interface Order {
  id: string
  orderId: string
  createdAt: string
  paidAmount: number
  status: string
}

interface OrderHistoryProps {
  userInfo: any
  orders: Order[]
}

const Orderhistory: React.FC<OrderHistoryProps> = (props) => {
  const { orders, userInfo } = props
  const router = useRouter()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-red-100 text-red-800 border-red-200"
    }
  }

  const menuItems = [
    { icon: <Home size={20} />, label: "Dashboard", href: "/dashboard" },
    { icon: <User size={20} />, label: "Personal Info", href: "/personal-info" },
    { icon: <MapPin size={20} />, label: "Addresses", href: "/address" },
    { icon: <Clock size={20} />, label: "Order History", href: "/order-history", active: true },
  ]

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false,
      })
      router.push("/")
      toast.success("Logged out successfully")
      router.refresh()
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  return (
    <div className="font-Outfit bg-gray-50 min-h-screen">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-pink-900 to-pink-500 py-24 px-6 relative overflow-hidden">
        <div className="container mx-auto flex items-center justify-between relative z-10">
          <div className="text-white">
            <h1 className="text-3xl font-bold">Order History</h1>
            <p className="text-indigo-100 mt-2">Track and manage your past orders</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
              <Clock size={32} className="text-white" />
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
              <h2 className="text-xl font-bold text-gray-800 mb-6">My Account</h2>
              <nav>
                <ul className="space-y-1">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link href={item.href}>
                        <div
                          className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${item.active ? "bg-indigo-50 text-pink-700" : "text-gray-600 hover:bg-gray-50"}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={item.active ? "text-pink-600" : "text-gray-500"}>{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                          </div>
                          {item.active && <ChevronRight size={16} className="text-pink-600" />}
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
                <h2 className="text-xl font-bold text-gray-800">Order History</h2>
              </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Your Orders</h3>
                <div className="text-sm text-gray-500">
                  {orders?.length} {orders?.length === 1 ? "order" : "orders"} placed
                </div>
              </div>

              {orders?.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                  <h4 className="text-xl font-medium text-gray-700">No orders yet</h4>
                  <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    You haven't placed any orders yet. Start shopping to see your order history here.
                  </p>
                  <Link href="/shop">
                    <div className="mt-6 inline-block px-6 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors">
                      Browse Products
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="pb-4 font-medium">Order ID</th>
                        <th className="pb-4 font-medium">Date</th>
                        <th className="pb-4 font-medium">Amount</th>
                        <th className="pb-4 font-medium">Status</th>
                        <th className="pb-4 font-medium text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {orders?.map((order) => (
                        <tr key={order.id || order.orderId} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 font-medium text-gray-800">{order?.orderId}</td>
                          <td className="py-4 text-gray-600">{formatDate(order?.createdAt)}</td>
                          <td className="py-4 font-medium text-gray-800">{formatCurrency(order?.paidAmount)}</td>
                          <td className="py-4">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(order?.status)}`}
                            >
                              {order?.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => router.push(`/order-history/${order?.orderId}`)}
                              className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-800 transition-colors font-medium text-sm"
                            >
                              View <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Order Information */}
            {orders?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Order Information</h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Track the status of your orders and view order details. For any questions about your orders, please
                    contact our customer support team.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 pt-2">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-800 mb-1">Need Help?</div>
                      <p className="text-sm">Contact our support team for assistance with your orders.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-800 mb-1">Returns</div>
                      <p className="text-sm">Initiate returns for eligible items within 30 days of delivery.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-800 mb-1">Shipping</div>
                      <p className="text-sm">Track your shipments and estimated delivery dates.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Orderhistory
export const dynamic = "force-dynamic"
