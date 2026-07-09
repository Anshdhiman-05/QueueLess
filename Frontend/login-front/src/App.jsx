import { Route, Routes, Navigate } from "react-router-dom"
import Dashboard from "./Pages/Dashboard"
import Login from "./Pages/Login"
import Signin from "./Pages/Signin"
import AdminDashboard from "./Pages/AdminDashboard"
import ProtectedRoute from "./Pages/ProtectedRoutes"
import AdminProtectedRoute from "./Pages/AdminProtectedRoute"


const App = () => {

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));


  return (

    <Routes>
      <Route path="/" element={loggedInUser ? loggedInUser.role === "admin" ? <Navigate to="/admin" /> : <Navigate to="/dashboard" /> : <Login />}/>
      <Route path="/signin" element={<Signin />}/>
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <AdminProtectedRoute>
        <AdminDashboard />
        </AdminProtectedRoute>
      }/>
    </Routes>
  )
}

export default App