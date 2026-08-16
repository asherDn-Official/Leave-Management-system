import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import toast from "react-hot-toast";

function LeaveRequests() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    // Rejection modal state
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedLeaveId, setSelectedLeaveId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [rejecting, setRejecting] = useState(false);

    useEffect(() => {
        fetchPendingLeaves();
    }, []);

    // ==========================================
    // Fetch Pending Leaves
    // ==========================================

    const fetchPendingLeaves = async () => {
        try {
            const response = await api.get(
                "/leaves/pending"
            );

            setLeaves(response.data.data);

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to fetch leave requests."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // Approve Leave
    // ==========================================

    const approveLeave = async (leaveId) => {
        try {
            const response = await api.put(
                `/leaves/approve/${leaveId}`
            );

            toast.success(
                response.data.message
            );

            fetchPendingLeaves();

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to approve leave."
            );
        }
    };

    // ==========================================
    // Open Reject Modal
    // ==========================================

    const openRejectModal = (leaveId) => {
        setSelectedLeaveId(leaveId);
        setRejectionReason("");
        setShowRejectModal(true);
    };

    // ==========================================
    // Close Reject Modal
    // ==========================================

    const closeRejectModal = () => {
        if (rejecting) {
            return;
        }

        setShowRejectModal(false);
        setSelectedLeaveId(null);
        setRejectionReason("");
    };

    // ==========================================
    // Reject Leave
    // ==========================================

    const rejectLeave = async () => {
        if (!rejectionReason.trim()) {
            toast.error(
                "Please enter a rejection reason."
            );

            return;
        }

        try {
            setRejecting(true);

            const response = await api.put(
                `/leaves/reject/${selectedLeaveId}`,
                {
                    rejectionReason:
                        rejectionReason.trim()
                }
            );

            toast.success(
                response.data.message
            );

            setShowRejectModal(false);
            setSelectedLeaveId(null);
            setRejectionReason("");

            fetchPendingLeaves();

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to reject leave."
            );
        } finally {
            setRejecting(false);
        }
    };

    // ==========================================
    // Render
    // ==========================================

    return (
        <DashboardLayout>
            <div className="p-8">

                <h1 className="mb-6 text-3xl font-bold">
                    Pending Leave Requests
                </h1>

                {loading ? (
                    <h2>Loading...</h2>
                ) : (
                    <div className="overflow-x-auto rounded-xl bg-white shadow">

                        <table className="min-w-full">

                            <thead className="bg-gray-100">

                                <tr>

                                    <th className="p-4 text-left">
                                        Employee
                                    </th>

                                    <th className="p-4 text-left">
                                        Leave Type
                                    </th>

                                    <th className="p-4 text-left">
                                        From
                                    </th>

                                    <th className="p-4 text-left">
                                        To
                                    </th>

                                    <th className="p-4 text-left">
                                        Days
                                    </th>

                                    <th className="p-4 text-left">
                                        Reason
                                    </th>

                                    <th className="p-4 text-center">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {leaves.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="p-8 text-center"
                                        >
                                            No pending leave requests.
                                        </td>
                                    </tr>
                                ) : (
                                    leaves.map((leave) => (
                                        <tr
                                            key={leave._id}
                                            className="border-t"
                                        >

                                            <td className="p-4">
                                                {leave.employee.fullName}
                                            </td>

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

                                                <div className="flex justify-center gap-3">

                                                    {/* Approve */}
                                                    <button
                                                        onClick={() =>
                                                            approveLeave(
                                                                leave._id
                                                            )
                                                        }
                                                        className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                                    >
                                                        Approve
                                                    </button>

                                                    {/* Reject */}
                                                    <button
                                                        onClick={() =>
                                                            openRejectModal(
                                                                leave._id
                                                            )
                                                        }
                                                        className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                                    >
                                                        Reject
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    ))
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {/* ==========================================
                Reject Leave Modal
            ========================================== */}

            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">

                        <h2 className="mb-2 text-2xl font-bold">
                            Reject Leave Request
                        </h2>

                        <p className="mb-5 text-sm text-gray-600">
                            Please provide a reason for rejecting
                            this leave request.
                        </p>

                        <textarea
                            value={rejectionReason}
                            onChange={(e) =>
                                setRejectionReason(
                                    e.target.value
                                )
                            }
                            placeholder="Enter rejection reason..."
                            rows="4"
                            className="w-full resize-none rounded-lg border border-gray-300 p-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                            disabled={rejecting}
                        />

                        <div className="mt-5 flex justify-end gap-3">

                            <button
                                onClick={closeRejectModal}
                                disabled={rejecting}
                                className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={rejectLeave}
                                disabled={
                                    rejecting ||
                                    !rejectionReason.trim()
                                }
                                className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {rejecting
                                    ? "Rejecting..."
                                    : "Reject Leave"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </DashboardLayout>
    );
}

export default LeaveRequests;