import { useEffect, useState } from "react";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import toast from "react-hot-toast";

function MyLeaves() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const response = await api.get(
                "/leaves/my-leaves"
            );

            setLeaves(response.data.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to fetch leave history."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (leaveId) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this leave request?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setCancellingId(leaveId);

            const response = await api.put(
                `/leaves/cancel/${leaveId}`
            );

            toast.success(
                response.data.message ||
                "Leave cancelled successfully."
            );

            await fetchLeaves();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to cancel leave."
            );
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Approved":
                return "bg-green-100 text-green-700";

            case "Rejected":
                return "bg-red-100 text-red-700";

            case "Cancelled":
                return "bg-gray-100 text-gray-700";

            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-8 text-xl">
                    Loading...
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-8">

                <h1 className="mb-6 text-3xl font-bold">
                    My Leaves
                </h1>

                <div className="overflow-x-auto rounded-xl bg-white shadow">

                    <table className="min-w-full">

                        <thead className="bg-gray-100">
                            <tr>

                                <th className="p-4 text-left">
                                    Leave Type
                                </th>

                                <th className="p-4 text-left">
                                    Start Date
                                </th>

                                <th className="p-4 text-left">
                                    End Date
                                </th>

                                <th className="p-4 text-left">
                                    Days
                                </th>

                                <th className="p-4 text-left">
                                    Reason
                                </th>

                                <th className="p-4 text-left">
                                    Status
                                </th>

                                <th className="p-4 text-left">
                                    Rejection Reason
                                </th>

                                <th className="p-4 text-left">
                                    Action
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {leaves.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="p-8 text-center"
                                    >
                                        No leave requests found.
                                    </td>
                                </tr>
                            ) : (
                                leaves.map((leave) => (
                                    <tr
                                        key={leave._id}
                                        className="border-t"
                                    >

                                        <td className="p-4">
                                            {leave.leaveType}
                                        </td>

                                        <td className="p-4">
                                            {new Date(
                                                leave.startDate
                                            ).toLocaleDateString()}
                                        </td>

                                        <td className="p-4">
                                            {new Date(
                                                leave.endDate
                                            ).toLocaleDateString()}
                                        </td>

                                        <td className="p-4">
                                            {leave.totalDays}
                                        </td>

                                        <td className="p-4">
                                            {leave.reason}
                                        </td>

                                        <td className="p-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                                                    leave.status
                                                )}`}
                                            >
                                                {leave.status}
                                            </span>
                                        </td>

                                        {/* Rejection Reason */}
                                        <td className="p-4">
                                            {leave.status ===
                                                "Rejected" &&
                                            leave.rejectionReason ? (
                                                <span className="font-medium text-red-600">
                                                    {leave.rejectionReason}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">
                                                    —
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-4">

                                            {(
                                                leave.status ===
                                                    "Pending" ||
                                                leave.status ===
                                                    "Approved"
                                            ) && (
                                                <button
                                                    onClick={() =>
                                                        handleCancel(
                                                            leave._id
                                                        )
                                                    }
                                                    disabled={
                                                        cancellingId ===
                                                        leave._id
                                                    }
                                                    className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {cancellingId ===
                                                    leave._id
                                                        ? "Cancelling..."
                                                        : "Cancel"}
                                                </button>
                                            )}

                                            {leave.status ===
                                                "Cancelled" && (
                                                <span className="text-sm text-gray-400">
                                                    —
                                                </span>
                                            )}

                                            {leave.status ===
                                                "Rejected" && (
                                                <span className="text-sm text-gray-400">
                                                    —
                                                </span>
                                            )}

                                        </td>

                                    </tr>
                                ))
                            )}

                        </tbody>

                    </table>

                </div>

            </div>
        </DashboardLayout>
    );
}

export default MyLeaves;