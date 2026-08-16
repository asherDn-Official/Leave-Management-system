import { useEffect, useState } from "react";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import toast from "react-hot-toast";

function ApplyLeave() {
    const [formData, setFormData] = useState({
        leaveType: "Casual Leave",
        startDate: "",
        endDate: "",
        totalDays: "",
        reason: "",
    });

    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [balanceLoading, setBalanceLoading] = useState(true);

    useEffect(() => {
        fetchLeaveBalance();
    }, []);

    const fetchLeaveBalance = async () => {
        try {
            const response = await api.get(
                "/leave-balances/my"
            );

            setBalance(response.data.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to fetch leave balance."
            );
        } finally {
            setBalanceLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const getSelectedBalance = () => {
        if (!balance) {
            return 0;
        }

        switch (formData.leaveType) {
            case "Casual Leave":
                return balance.casualLeave?.remaining || 0;

            case "Sick Leave":
                return balance.sickLeave?.remaining || 0;

            case "Earned Leave":
                return balance.earnedLeave?.remaining || 0;

            default:
                return 0;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await api.post(
                "/leaves/apply",
                formData
            );

            toast.success(
                response.data.message ||
                "Leave applied successfully."
            );

            setFormData({
                leaveType: "Casual Leave",
                startDate: "",
                endDate: "",
                totalDays: "",
                reason: "",
            });
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    const selectedBalance = getSelectedBalance();

    return (
        <DashboardLayout>
            <div className="p-8">
                <div className="mx-auto max-w-2xl">

                    <div className="mb-6">
                        <h1 className="text-3xl font-bold">
                            Apply Leave
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Check your available leave balance
                            before applying.
                        </p>
                    </div>

                    {/* Leave Balance */}
                    <div className="mb-6 rounded-xl bg-white p-6 shadow">
                        <h2 className="mb-4 text-xl font-semibold">
                            Leave Balance
                        </h2>

                        {balanceLoading ? (
                            <p className="text-gray-500">
                                Loading leave balance...
                            </p>
                        ) : !balance ? (
                            <p className="text-red-500">
                                Leave balance has not been assigned yet.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="text-sm text-gray-500">
                                        Casual Leave
                                    </p>

                                    <p className="mt-1 text-2xl font-bold">
                                        {balance.casualLeave?.remaining || 0}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        days available
                                    </p>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="text-sm text-gray-500">
                                        Sick Leave
                                    </p>

                                    <p className="mt-1 text-2xl font-bold">
                                        {balance.sickLeave?.remaining || 0}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        days available
                                    </p>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="text-sm text-gray-500">
                                        Earned Leave
                                    </p>

                                    <p className="mt-1 text-2xl font-bold">
                                        {balance.earnedLeave?.remaining || 0}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        days available
                                    </p>
                                </div>

                            </div>
                        )}
                    </div>

                    {/* Apply Leave Form */}
                    <div className="rounded-xl bg-white p-8 shadow">

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Leave Type */}
                            <div>
                                <label className="mb-2 block font-medium">
                                    Leave Type
                                </label>

                                <select
                                    name="leaveType"
                                    value={formData.leaveType}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border p-3"
                                    required
                                >
                                    <option value="Casual Leave">
                                        Casual Leave
                                    </option>

                                    <option value="Sick Leave">
                                        Sick Leave
                                    </option>

                                    <option value="Earned Leave">
                                        Earned Leave
                                    </option>
                                </select>

                                {!balanceLoading && balance && (
                                    <p className="mt-2 text-sm text-gray-500">
                                        Available balance:{" "}
                                        <span className="font-semibold text-gray-700">
                                            {selectedBalance} day(s)
                                        </span>
                                    </p>
                                )}
                            </div>

                            {/* Start Date */}
                            <div>
                                <label className="mb-2 block font-medium">
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border p-3"
                                    required
                                />
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="mb-2 block font-medium">
                                    End Date
                                </label>

                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border p-3"
                                    required
                                />
                            </div>

                            {/* Total Days */}
                            <div>
                                <label className="mb-2 block font-medium">
                                    Total Days
                                </label>

                                <input
                                    type="number"
                                    name="totalDays"
                                    value={formData.totalDays}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border p-3"
                                    min="1"
                                    required
                                />
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="mb-2 block font-medium">
                                    Reason
                                </label>

                                <textarea
                                    rows="5"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border p-3"
                                    required
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading || balanceLoading}
                                className="w-full rounded-lg bg-indigo-600 p-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading
                                    ? "Submitting..."
                                    : "Apply Leave"}
                            </button>

                        </form>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default ApplyLeave;