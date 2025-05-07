"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import { Package, Clock, Truck, CheckCircle, RefreshCw, Search } from "lucide-react"
import ConfirmModal from "../../components/ConfirmModal"

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredOrders, setFilteredOrders] = useState([])
  const [statusFilter, setStatusFilter] = useState("Tất cả")
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    orderId: null,
    newStatus: "",
    title: "",
    message: "",
  })

  // Fetch all orders from API
  const fetchAllOrders = async () => {
    setLoading(true)
    try {
      const response = await axios.get(url + "/api/order/list")
      if (response.data.success) {
        setOrders(response.data.data)
        setFilteredOrders(response.data.data)
      } else {
        toast.error(response.data.message || "Lỗi khi tải danh sách đơn hàng")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error(error.response?.data?.message || "Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  // Update order status
  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value

    setConfirmModal({
      isOpen: true,
      orderId: orderId,
      newStatus: newStatus,
      title: "Xác nhận thay đổi trạng thái",
      message: `Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng thành "${newStatus}"?`,
    })
  }

  const handleConfirmStatusChange = async () => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId: confirmModal.orderId,
        status: confirmModal.newStatus,
      })

      if (response.data.success) {
        await fetchAllOrders()
        toast.success("Trạng thái đơn hàng đã được cập nhật")
      } else {
        toast.error(response.data.message || "Lỗi khi cập nhật trạng thái đơn hàng")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.")
    }

    // Close the confirmation modal
    setConfirmModal({
      isOpen: false,
      orderId: null,
      newStatus: "",
      title: "",
      message: "",
    })
  }

  useEffect(() => {
    fetchAllOrders()
  }, [])

  useEffect(() => {
    // Filter orders based on search term and status filter
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.address.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.address.phone.includes(searchTerm),
      )
    }

    if (statusFilter !== "Tất cả") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [searchTerm, statusFilter, orders])

  // Get status icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case "Đang xử lý":
        return <Clock size={20} className="text-yellow-500" />
      case "Đang giao hàng":
        return <Truck size={20} className="text-blue-500" />
      case "Đã giao":
        return <CheckCircle size={20} className="text-green-500" />
      default:
        return <Package size={20} className="text-gray-500" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white dark:bg-dark-light rounded-2xl shadow-custom p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Quản lý đơn hàng</h1>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark py-3 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark py-3 px-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Đang giao hàng">Đang giao hàng</option>
              <option value="Đã giao">Đã giao</option>
            </select>
            <button
              onClick={fetchAllOrders}
              className="ml-2 p-3 bg-gray-100 dark:bg-dark-lighter rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-dark transition-colors"
              title="Refresh"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white dark:bg-dark rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-dark-lighter p-5"
              >
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                      <Package size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{order.address.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.date).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(order.status)}
                    <select
                      onChange={(event) => statusHandler(event, order._id)}
                      value={order.status}
                      className="ml-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Đang xử lý">Đang xử lý</option>
                      <option value="Đang giao hàng">Đang giao hàng</option>
                      <option value="Đã giao">Đã giao</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-dark-lighter rounded-lg">
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Các món</h3>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-gray-800 dark:text-white">
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
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Thông tin</h3>
                    <p className="text-gray-800 dark:text-white mb-1">
                      <span className="text-gray-500 dark:text-gray-400">Địa chỉ:</span> {order.address.street}
                    </p>
                    <p className="text-gray-800 dark:text-white mb-1">
                      <span className="text-gray-500 dark:text-gray-400">SĐT:</span> {order.address.phone}
                    </p>
                    <p className="text-xl font-bold text-primary mt-2">{order.amount.toLocaleString("vi-VN")} đ</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-dark-lighter rounded-xl">
            <Package size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl text-gray-500 dark:text-gray-400 mb-2">Không có đơn hàng nào</h3>
            <p className="text-gray-400 dark:text-gray-500">Chưa có đơn hàng nào phù hợp với tìm kiếm của bạn</p>
          </div>
        )}
      </div>

      {/* Confirm Status Change Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({
            isOpen: false,
            orderId: null,
            newStatus: "",
            title: "",
            message: "",
          })
        }
        onConfirm={handleConfirmStatusChange}
        title={confirmModal.title}
        message={confirmModal.message}
      />
    </div>
  )
}

export default Orders
