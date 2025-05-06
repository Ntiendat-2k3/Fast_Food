import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Add from "./pages/Add/Add"
import List from "./pages/List/List"
import Orders from "./pages/Orders/Orders"
import Profile from "./pages/Profile/Profile"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Revenue from "./pages/Revenue/Revenue"
import { ThemeProvider } from "./context/ThemeContext"
import "./index.css"

const App = () => {
  const url = "http://localhost:4000"

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-dark text-gray-900 dark:text-white transition-colors duration-300">
        <ToastContainer />
        <Navbar />
        <main className="container mx-auto px-4 py-6 mt-24">
          <Routes>
            <Route path="/add" element={<Add url={url} />} />
            <Route path="/list" element={<List url={url} />} />
            <Route path="/" element={<Orders url={url} />} />
            <Route path="/revenue" element={<Revenue url={url} />} />
            <Route path="/profile" element={<Profile url={url} />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
