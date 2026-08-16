import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";


import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";


import Home from "../pages/employee/Home";

import Calendar from "../pages/employee/Calendar";
import ApplyLeave from "../pages/employee/ApplyLeave";
import MyLeaves from "../pages/employee/MyLeaves";


import Employees from "../pages/admin/Employees";
import LeaveRequests from "../pages/admin/LeaveRequests";


import PendingRegistrations from "../pages/superAdmin/PendingRegistrations";
import LeaveBalances from "../pages/superAdmin/LeaveBalances";


import ProtectedRoute from "./ProtectedRoute";
import Attendance from "../pages/superAdmin/Attendance";

function AppRoutes() {

    return (

        <Routes>

            {/* Default */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />


            {/* Authentication */}

            <Route
                path="/login"
                element={
                    <Login />
                }
            />

            <Route
                path="/register"
                element={
                    <Register />
                }
            />


            {/* Home */}

            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />


            {/* Calendar */}

            <Route
                path="/calendar"
                element={
                    <ProtectedRoute>
                        <Calendar />
                    </ProtectedRoute>
                }
            />


            {/* Apply Leave */}

            <Route
                path="/apply-leave"
                element={
                    <ProtectedRoute>
                        <ApplyLeave />
                    </ProtectedRoute>
                }
            />


            {/* My Leaves */}

            <Route
                path="/my-leaves"
                element={
                    <ProtectedRoute>
                        <MyLeaves />
                    </ProtectedRoute>
                }
            />


            {/* Leave Requests */}

            <Route
                path="/leave-requests"
                element={
                    <ProtectedRoute>
                        <LeaveRequests />
                    </ProtectedRoute>
                }
            />


            {/* Employees */}

            <Route
                path="/employees"
                element={
                    <ProtectedRoute>
                        <Employees />
                    </ProtectedRoute>
                }
            />


            {/* Pending Registrations */}

            <Route
                path="/pending-registrations"
                element={
                    <ProtectedRoute>
                        <PendingRegistrations />
                    </ProtectedRoute>
                }
            />


            {/* Leave Balances */}

            <Route
                path="/leave-balances"
                element={
                    <ProtectedRoute>
                        <LeaveBalances />
                    </ProtectedRoute>
                }
            />
            <Route
    path="/attendance"
    element={
        <ProtectedRoute>
            <Attendance />
        </ProtectedRoute>
    }
/>

        </Routes>
    );
}


export default AppRoutes;