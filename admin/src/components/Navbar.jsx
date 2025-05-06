"use client"

import { useNavigate, useLocation } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { Sun, Moon, Settings, Menu, X } from "lucide-react"
import { useState } from "react"

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { darkMode, toggleDarkMode } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: "/add", label: "Thêm sản phẩm" },
    { path: "/list", label: "Danh sách sản phẩm" },
    { path: "/", label: "Quản lý đơn hàng" },
    { path: "/revenue", label: "Doanh thu" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-dark-light shadow-md py-3">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <div className="bg-primary p-2 rounded-lg mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-dark"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-dark dark:text-white">Admin Panel</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary text-dark"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-lighter"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-lighter rounded-full transition-colors"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-lighter rounded-full transition-colors"
            >
              <Settings size={20} />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-lighter rounded-full transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white dark:bg-dark-light rounded-xl shadow-custom p-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path)
                    setMobileMenuOpen(false)
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary text-dark"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-lighter"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
