import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import {
    getPendingRegistrations,
    approveRegistration,
    rejectRegistration,
} from "../../services/superAdmin.service";


function PendingRegistrations() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedRole, setSelectedRole] = useState("USER");

    useEffect(() => {
        fetchPendingRegistrations();
    }, []);

    const fetchPendingRegistrations = async () => {
        try {
            const response = await getPendingRegistrations();
            setRegistrations(response.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to fetch pending registrations."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = (id) => {
        setSelectedUserId(id);
        setSelectedRole("USER");
        setShowRoleModal(true);
    };

    const confirmApprove = async () => {
        try {
            const response = await approveRegistration(
                selectedUserId,
                selectedRole
            );

            toast.success(response.message);

            setRegistrations((previous) =>
                previous.filter(
                    (user) => user._id !== selectedUserId
                )
            );

            setShowRoleModal(false);
            setSelectedUserId(null);
            setSelectedRole("USER");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to approve registration."
            );
        }
    };

    const handleReject = async (id) => {
        try {
            const response = await rejectRegistration(id);

            toast.success(response.message);

            setRegistrations((previous) =>
                previous.filter((user) => user._id !== id)
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to reject registration."
            );
        }
    };

    return (
        <DashboardLayout>
            <h1 className="mb-6 text-3xl font-bold">
                Pending Registrations
            </h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-x-auto rounded-lg bg-white shadow">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-3">
                                    Employee ID
                                </th>
                                <th className="border p-3">
                                    Full Name
                                </th>
                                <th className="border p-3">
                                    Email
                                </th>
                                <th className="border p-3">
                                    Phone
                                </th>
                                <th className="border p-3">
                                    Designation
                                </th>
                                <th className="border p-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {registrations.map((user) => (
                                <tr key={user._id}>
                                    <td className="border p-3">
                                        {user.employeeId}
                                    </td>

                                    <td className="border p-3">
                                        {user.fullName}
                                    </td>

                                    <td className="border p-3">
                                        {user.email}
                                    </td>

                                    <td className="border p-3">
                                        {user.phoneNumber}
                                    </td>

                                    <td className="border p-3">
                                        {user.designation}
                                    </td>

                                    <td className="border p-3">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() =>
                                                    handleApprove(
                                                        user._id
                                                    )
                                                }
                                                className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                                            >
                                                Approve
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleReject(
                                                        user._id
                                                    )
                                                }
                                                className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showRoleModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
                        <h2 className="mb-4 text-2xl font-bold">
                            Approve Registration
                        </h2>

                        <label className="mb-2 block font-medium">
                            Select Role
                        </label>

                        <select
                            value={selectedRole}
                            onChange={(e) =>
                                setSelectedRole(
                                    e.target.value
                                )
                            }
                            className="mb-6 w-full rounded border p-3"
                        >
                            <option value="USER">
                                USER
                            </option>

                            <option value="ADMIN">
                                ADMIN
                            </option>
                        </select>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() =>
                                    setShowRoleModal(false)
                                }
                                className="rounded bg-gray-300 px-4 py-2"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmApprove}
                                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default PendingRegistrations;