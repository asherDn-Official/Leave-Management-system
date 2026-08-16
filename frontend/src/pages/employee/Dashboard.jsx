
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import toast from "react-hot-toast";

function Dashboard() {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await api.get("/dashboard/stats");
            setStats(response.data.data);
        }  catch (error) {
    toast.error(
        error.response?.data?.message ||
        "Failed to load dashboard."
    );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-8">
                    <h2 className="text-xl">Loading...</h2>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>

            <div className="p-8">

                <h1 className="mb-8 text-4xl font-bold">
                    Welcome, {user.fullName}
                </h1>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

                    {user.role === "USER" && (
                        <>
                            <Card
                                title="Total Leaves"
                                value={stats.totalLeaves}
                                color="bg-blue-600"
                            />

                            <Card
                                title="Pending Leaves"
                                value={stats.pendingLeaves}
                                color="bg-yellow-500"
                            />

                            <Card
                                title="Approved Leaves"
                                value={stats.approvedLeaves}
                                color="bg-green-600"
                            />

                            <Card
                                title="Rejected Leaves"
                                value={stats.rejectedLeaves}
                                color="bg-red-600"
                            />
                        </>
                    )}

                    {user.role === "ADMIN" && (
                        <>
                            <Card
                                title="Employees"
                                value={stats.totalEmployees}
                                color="bg-indigo-600"
                            />

                            <Card
                                title="Pending Leaves"
                                value={stats.pendingLeaves}
                                color="bg-yellow-500"
                            />

                            <Card
                                title="Approved Leaves"
                                value={stats.approvedLeaves}
                                color="bg-green-600"
                            />

                            <Card
                                title="Rejected Leaves"
                                value={stats.rejectedLeaves}
                                color="bg-red-600"
                            />
                        </>
                    )}

                    {user.role === "SUPER_ADMIN" && (
                        <>
                            <Card
                                title="Employees"
                                value={stats.totalEmployees}
                                color="bg-indigo-600"
                            />

                            <Card
                                title="Pending Registrations"
                                value={stats.pendingRegistrations}
                                color="bg-orange-500"
                            />

                            <Card
                                title="Pending Leaves"
                                value={stats.pendingLeaves}
                                color="bg-yellow-500"
                            />

                            <Card
                                title="Approved Leaves"
                                value={stats.approvedLeaves}
                                color="bg-green-600"
                            />

                            <Card
                                title="Rejected Leaves"
                                value={stats.rejectedLeaves}
                                color="bg-red-600"
                            />
                        </>
                    )}

                </div>

            </div>

        </DashboardLayout>
    );
}

function Card({ title, value, color }) {
    return (
        <div
            className={`${color} rounded-xl p-6 text-white shadow-lg`}
        >
            <h2 className="text-lg font-medium">
                {title}
            </h2>

            <p className="mt-4 text-4xl font-bold">
                {value ?? 0}
            </p>
        </div>
    );
}

export default Dashboard;

