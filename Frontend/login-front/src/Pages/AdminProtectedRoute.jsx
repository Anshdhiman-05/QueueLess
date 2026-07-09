import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {

    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    if (!loggedInUser) {
        return <Navigate to="/" />;
    }

    if (loggedInUser.role !== "admin") {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default AdminProtectedRoute;