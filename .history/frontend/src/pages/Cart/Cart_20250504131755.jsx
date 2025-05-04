"use client";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, CreditCard } from "lucide-react";
import { StoreContext } from "../../context/StoreContext";

const Cart = () => {
  const { cartItems, food_list, removeFromCartAll, getTotalCartAmount, url } =
    useContext(StoreContext);
  const navigate = useNavigate();

  // Check if cart is empty
  const isCartEmpty = Object.values(cartItems).every(
    (quantity) => quantity === 0
  );

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-dark-lighter mt-20 mx-4 md:mx-auto max-w-6xl transition-colors duration-300">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-dark dark:text-white mb-6">
          Giỏ hàng của bạn
        </h1>

        {isCartEmpty ? (
          <div className="text-center py-12">
            <ShoppingBag
              size={64}
              className="mx-auto text-gray-400 dark:text-gray-600 mb-4"
            />
            <h2 className="text-xl text-gray-500 dark:text-gray-400 mb-4">
              Giỏ hàng của bạn đang trống
            </h2>
            <button
              onClick={() => navigate("/foods")}
              className="bg-primary hover:bg-primary-light text-dark py-2 px-6 rounded-lg transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200 dark:border-dark-lighter">
                    <th className="pb-4 text-dark dark:text-white font-medium">
                      Sản phẩm
                    </th>
                    <th className="pb-4 text-dark dark:text-white font-medium">
                      Giá
                    </th>
                    <th className="pb-4 text-dark dark:text-white font-medium">
                      Số lượng
                    </th>
                    <th className="pb-4 text-dark dark:text-white font-medium">
                      Tổng tiền
                    </th>
                    <th className="pb-4 text-dark dark:text-white font-medium">
                      Xóa
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {food_list.map((item, index) => {
                    if (cartItems[item._id] > 0) {
                      return (
                        <tr
                          key={index}
                          className="border-b border-gray-200 dark:border-dark-lighter"
                        >
                          <td className="py-4">
                            <div className="flex items-center">
                              <img
                                src={
                                  url + "/images/" + item.image ||
                                  "/placeholder.svg"
                                }
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg mr-4"
                              />
                              <span className="text-dark dark:text-white">
                                {item.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 text-gray-600 dark:text-gray-300">
                            {item.price.toLocaleString("vi-VN")} đ
                          </td>
                          <td className="py-4 text-gray-600 dark:text-gray-300">
                            {cartItems[item._id]}
                          </td>
                          <td className="py-4 text-dark dark:text-white font-medium">
                            {(item.price * cartItems[item._id]).toLocaleString(
                              "vi-VN"
                            )}{" "}
                            đ
                          </td>
                          <td className="py-4">
                            <button
                              onClick={() => removeFromCartAll(item._id)}
                              className="text-red-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={20} />
                            </button>
                          </td>
                        </tr>
                      );
                    }
                    return null;
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 dark:bg-dark-light p-6 rounded-xl border border-gray-200 dark:border-dark-lighter">
                <h3 className="text-lg font-medium text-dark dark:text-white mb-4">
                  Mã giảm giá
                </h3>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Nhập mã giảm giá..."
                    className="flex-1 bg-white dark:bg-dark text-dark dark:text-white border border-gray-300 dark:border-dark-lighter rounded-l-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button className="bg-primary hover:bg-primary-light text-dark py-3 px-6 rounded-r-lg transition-colors">
                    Áp dụng
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-dark-light p-6 rounded-xl border border-gray-200 dark:border-dark-lighter">
                <h3 className="text-lg font-medium text-dark dark:text-white mb-4">
                  Tổng giỏ hàng
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Tạm tính
                    </span>
                    <span className="text-dark dark:text-white">
                      {getTotalCartAmount().toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Phí vận chuyển
                    </span>
                    <span className="text-dark dark:text-white">
                      {(getTotalCartAmount() === 0 ? 0 : 14000).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      đ
                    </span>
                  </div>
                  <div className="border-t border-gray-300 dark:border-dark-lighter pt-3 flex justify-between">
                    <span className="text-lg font-medium text-dark dark:text-white">
                      Tổng cộng
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {(getTotalCartAmount() === 0
                        ? 0
                        : getTotalCartAmount() + 14000
                      ).toLocaleString("vi-VN")}{" "}
                      đ
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/order")}
                  className="mt-6 w-full bg-primary hover:bg-primary-light text-dark py-3 rounded-lg flex items-center justify-center transition-colors"
                >
                  <CreditCard size={20} className="mr-2" />
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
