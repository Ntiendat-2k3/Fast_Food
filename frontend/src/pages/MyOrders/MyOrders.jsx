"use client"

import { useContext, useEffect, useState } from "react"
import { StoreContext } from "../../context/StoreContext"
import axios from "axios"
import { Package, Clock, CheckCircle, AlertTriangle, CreditCard, Truck, Wallet, Landmark } from "lucide-react"

const MyOrders = () => {
  const { url, token } = useContext(StoreContext)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } })
      setData(response.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchOrders()
    }
  }, [token])

  const getStatusIcon = (status) => {
    switch (status) {
      case "Đang xử lý":
        return <Clock size={20} className="text-yellow-500" />
      case "Đang giao hàng":
        return <Package size={20} className="text-blue-500" />
      case "Đã giao hàng":
        return <CheckCircle size={20} className="text-green-500" />
      default:
        return <AlertTriangle size={20} className="text-red-500" />
    }
  }

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "COD":
        return <Truck size={20} className="text-gray-600 dark:text-gray-300" />
      case "VNPay":
        return <CreditCard size={20} className="text-blue-500" />
      case "MoMo":
        return <Wallet size={20} className="text-pink-500" />
      case "BankTransfer":
        return <Landmark size={20} className="text-green-500" />
      default:
        return <CreditCard size={20} className="text-gray-500" />
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Đã thanh toán":
        return "text-green-500"
      case "Đang xử lý":
        return "text-yellow-500"
      case "Thanh toán thất bại":
        return "text-red-500"
      default:
        return "text-gray-500 dark:text-gray-400"
    }
  }

  // Format date function to handle invalid dates
  const formatDate = (dateString) => {
    if (!dateString) return "Không có ngày"

    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Ngày không hợp lệ"
    }

    // Format date to Vietnamese format
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden mt-20 mx-4 md:mx-auto max-w-6xl transition-colors duration-300">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-dark dark:text-white mb-6">Đơn hàng của tôi</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Đang tải đơn hàng...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-500 dark:text-gray-400 mb-4" />
            <h2 className="text-xl text-gray-500 dark:text-gray-400 mb-2">Bạn chưa có đơn hàng nào</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Hãy đặt món ăn đầu tiên của bạn ngay bây giờ</p>
            <button
              onClick={() => (window.location.href = "/foods")}
              className="bg-primary hover:bg-primary-light text-dark py-2 px-6 rounded-lg transition-colors"
            >
              Xem thực đơn
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((order, index) => (
              <div key={index} className="bg-gray-50 dark:bg-dark-light rounded-xl p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                      <Package size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-dark dark:text-white font-medium">Đơn hàng #{order._id.slice(-6)}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{formatDate(order.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(order.status)}
                    <span className="ml-2 text-dark dark:text-white">{order.status}</span>
                  </div>
                </div>

                <div className="border-t border-gray-300 dark:border-dark-lighter pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <h3 className="text-gray-500 dark:text-gray-400 mb-2 text-sm">Các món</h3>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="text-dark dark:text-white">
                              {item.name} <span className="text-gray-500 dark:text-gray-400">x{item.quantity}</span>
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">
                              {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-gray-500 dark:text-gray-400 mb-2 text-sm">Thông tin</h3>
                      <p className="text-gray-800 dark:text-white mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Địa chỉ:</span> {order.address.street}
                      </p>
                      <p className="text-gray-800 dark:text-white mb-1">
                        <span className="text-gray-500 dark:text-gray-400">SĐT:</span> {order.address.phone}
                      </p>
                      <div className="flex items-center mt-2 mb-1">
                        {getPaymentMethodIcon(order.paymentMethod)}
                        <span className="ml-2 text-gray-800 dark:text-white">
                          {order.paymentMethod === "COD"
                            ? "Thanh toán khi nhận hàng"
                            : order.paymentMethod === "VNPay"
                              ? "Thanh toán qua VNPay"
                              : order.paymentMethod === "MoMo"
                                ? "Thanh toán qua MoMo"
                                : "Chuyển khoản ngân hàng"}
                        </span>
                      </div>
                      <p className={`mb-3 ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus || "Chưa thanh toán"}
                      </p>
                      <p className="text-xl font-bold text-primary">{order.amount.toLocaleString("vi-VN")} đ</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders
