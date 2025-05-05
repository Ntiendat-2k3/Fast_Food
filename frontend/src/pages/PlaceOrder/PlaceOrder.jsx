"use client"

import { useEffect, useState } from "react"
import { useContext } from "react"
import { StoreContext } from "../../context/StoreContext"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { CreditCard, MapPin, Phone, User } from "lucide-react"

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext)

  const [data, setData] = useState({
    name: "",
    street: "",
    phone: "",
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData((data) => ({ ...data, [name]: value }))
  }

  const placeOrder = async (event) => {
    event.preventDefault()
    const orderItems = []
    food_list.map((item) => {
      if (cartItems[item.name] > 0) {
        const itemInfo = item
        itemInfo["quantity"] = cartItems[item.name]
        orderItems.push(itemInfo)
      }
    })
    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 14000,
    }

    try {
      const response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      })
      if (response.data.success) {
        const { session_url } = response.data
        window.location.replace(session_url)
      } else {
        toast.success("Thanh toán thành công")
        setTimeout(() => {
          navigate("/thankyou")
        }, 2000)
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.")
    }
  }

  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate("/cart")
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart")
    }
  }, [token])

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden mt-20 mx-4 md:mx-auto max-w-6xl transition-colors duration-300">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-dark dark:text-white mb-8">Thanh toán</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white mb-6">Thông tin vận chuyển</h2>
            <form onSubmit={placeOrder} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  className="w-full bg-white dark:bg-dark-light text-dark dark:text-white border border-gray-300 dark:border-dark-lighter rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  name="name"
                  onChange={onChangeHandler}
                  value={data.name}
                  type="text"
                  placeholder="Họ tên người nhận"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                <textarea
                  className="w-full bg-white dark:bg-dark-light text-dark dark:text-white border border-gray-300 dark:border-dark-lighter rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                  required
                  name="street"
                  onChange={onChangeHandler}
                  value={data.street}
                  placeholder="Địa chỉ giao hàng chi tiết"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  className="w-full bg-white dark:bg-dark-light text-dark dark:text-white border border-gray-300 dark:border-dark-lighter rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  name="phone"
                  onChange={onChangeHandler}
                  value={data.phone}
                  type="text"
                  placeholder="Số điện thoại liên hệ"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-light text-dark py-3 rounded-lg flex items-center justify-center transition-colors mt-6"
              >
                <CreditCard size={20} className="mr-2" />
                Xác nhận đặt hàng
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white mb-6">Đơn hàng của bạn</h2>
            <div className="bg-gray-50 dark:bg-dark-light rounded-xl p-6">
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {food_list.map((item, index) => {
                  if (cartItems[item.name] > 0) {
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={url + "/images/" + item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg mr-3"
                          />
                          <div>
                            <p className="text-dark dark:text-white">{item.name}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                              {item.price.toLocaleString("vi-VN")} đ x {cartItems[item.name]}
                            </p>
                          </div>
                        </div>
                        <p className="text-dark dark:text-white font-medium">
                          {(item.price * cartItems[item.name]).toLocaleString("vi-VN")} đ
                        </p>
                      </div>
                    )
                  }
                  return null
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-300 dark:border-dark-lighter space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Tạm tính</span>
                  <span className="text-dark dark:text-white">{getTotalCartAmount().toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Phí vận chuyển</span>
                  <span className="text-dark dark:text-white">14.000 đ</span>
                </div>
                <div className="pt-3 flex justify-between">
                  <span className="text-lg font-medium text-dark dark:text-white">Tổng cộng</span>
                  <span className="text-lg font-bold text-primary">
                    {(getTotalCartAmount() + 14000).toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default PlaceOrder
