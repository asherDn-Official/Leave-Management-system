import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function Calendar() {
    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const role = user?.role;

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            let response;

            /*
             * USER
             * ----
             * See only their own APPROVED leaves.
             *
             * ADMIN / SUPER_ADMIN
             * -------------------
             * See all APPROVED leaves.
             */
            if (
                role === "ADMIN" ||
                role === "SUPER_ADMIN"
            ) {
                response = await api.get(
                    "/leaves/all"
                );

                const approvedLeaves =
                    (response.data.data || []).filter(
                        (leave) =>
                            leave.status === "Approved"
                    );

                setLeaves(approvedLeaves);
            } else {
                response = await api.get(
                    "/leaves/my-leaves"
                );

                const approvedLeaves =
                    (response.data.data || []).filter(
                        (leave) =>
                            leave.status === "Approved"
                    );

                setLeaves(approvedLeaves);
            }

        } catch (error) {
            console.error(
                "Calendar API Error:",
                error.response?.data || error
            );

            setLeaves([]);
        } finally {
            setLoading(false);
        }
    };

    /*
     * Get TODAY + next 6 days.
     *
     * Example:
     *
     * Today = Saturday
     *
     * Saturday
     * Sunday
     * Monday
     * Tuesday
     * Wednesday
     * Thursday
     * Friday
     */
    const getWeekDates = () => {
        const today = new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );

        return Array.from(
            { length: 7 },
            (_, index) => {
                const date = new Date(today);

                date.setDate(
                    today.getDate() + index
                );

                return date;
            }
        );
    };

    const weekDates = getWeekDates();

    /*
     * Convert Date to YYYY-MM-DD.
     */
    const formatDate = (date) => {
        const year =
            date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    /*
     * Normalize backend dates.
     */
    const normalizeDate = (value) => {
        if (!value) {
            return null;
        }

        const stringValue =
            String(value);

        if (
            /^\d{4}-\d{2}-\d{2}/.test(
                stringValue
            )
        ) {
            return stringValue.substring(
                0,
                10
            );
        }

        const date = new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return null;
        }

        return formatDate(date);
    };

    /*
     * Get leaves that cover
     * a particular day.
     *
     * IMPORTANT:
     * Only APPROVED leaves are allowed
     * to appear on the calendar.
     */
    const getLeavesForDate = (date) => {
        const targetDate =
            formatDate(date);

        return leaves.filter((leave) => {
            /*
             * Safety check:
             * Never display Pending,
             * Rejected or Cancelled leaves.
             */
            if (
                leave.status !== "Approved"
            ) {
                return false;
            }

            const startDate =
                normalizeDate(
                    leave.startDate
                );

            const endDate =
                normalizeDate(
                    leave.endDate
                );

            if (
                !startDate ||
                !endDate
            ) {
                return false;
            }

            return (
                targetDate >= startDate &&
                targetDate <= endDate
            );
        });
    };

    /*
     * Colors based on leave type.
     */
    const getLeaveColor = (
        leaveType
    ) => {
        switch (
            leaveType?.toLowerCase()
        ) {
            case "annual":
                return "border-blue-200 bg-blue-100 text-blue-700";

            case "sick":
                return "border-red-200 bg-red-100 text-red-700";

            case "casual":
                return "border-green-200 bg-green-100 text-green-700";

            case "paid":
                return "border-purple-200 bg-purple-100 text-purple-700";

            case "unpaid":
                return "border-gray-300 bg-gray-200 text-gray-700";

            default:
                return "border-indigo-200 bg-indigo-100 text-indigo-700";
        }
    };

    return (
        <DashboardLayout>

            <div className="space-y-6">

                {/* Header */}

                <div className="flex items-end justify-between">

                    <div>

                        <h1 className="text-3xl font-bold text-slate-800">
                            Leave Calendar
                        </h1>

                        <p className="mt-2 text-slate-500">
                            {role === "ADMIN" ||
                            role === "SUPER_ADMIN"
                                ? "View approved employee leave schedules."
                                : "View your approved leave schedule and upcoming leave days."
                            }
                        </p>

                    </div>

                    <p className="text-sm text-slate-500">

                        {weekDates[0].toLocaleDateString(
                            "en-US",
                            {
                                month: "short",
                                day: "numeric",
                            }
                        )}

                        {" - "}

                        {weekDates[6].toLocaleDateString(
                            "en-US",
                            {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            }
                        )}

                    </p>

                </div>

                {/* Calendar */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* Week Header */}

                    <div className="grid grid-cols-7 border-b border-slate-200">

                        {weekDates.map(
                            (date) => {

                                const isToday =
                                    formatDate(
                                        date
                                    ) ===
                                    formatDate(
                                        new Date()
                                    );

                                return (
                                    <div
                                        key={formatDate(
                                            date
                                        )}
                                        className="border-r border-slate-200 p-4 text-center last:border-r-0"
                                    >

                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            {date.toLocaleDateString(
                                                "en-US",
                                                {
                                                    weekday:
                                                        "short",
                                                }
                                            )}
                                        </p>

                                        <div
                                            className={`mx-auto mt-2 flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${
                                                isToday
                                                    ? "bg-indigo-600 text-white"
                                                    : "text-slate-800"
                                            }`}
                                        >
                                            {date.getDate()}
                                        </div>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {date.toLocaleDateString(
                                                "en-US",
                                                {
                                                    month:
                                                        "short",
                                                }
                                            )}
                                        </p>

                                    </div>
                                );
                            }
                        )}

                    </div>

                    {/* Calendar Body */}

                    {loading ? (

                        <div className="p-12 text-center text-slate-500">
                            Loading leave calendar...
                        </div>

                    ) : (

                        <div className="grid min-h-[320px] grid-cols-7">

                            {weekDates.map(
                                (date) => {

                                    const dateLeaves =
                                        getLeavesForDate(
                                            date
                                        );

                                    return (
                                        <div
                                            key={formatDate(
                                                date
                                            )}
                                            className="min-h-[220px] border-r border-slate-200 p-3 last:border-r-0"
                                        >

                                            {dateLeaves.length ===
                                            0 ? (

                                                <div className="flex h-full min-h-[190px] items-center justify-center rounded-xl bg-slate-50">

                                                    <span className="text-xs text-slate-400">
                                                        No leave
                                                    </span>

                                                </div>

                                            ) : (

                                                <div className="space-y-2">

                                                    {dateLeaves.map(
                                                        (
                                                            leave
                                                        ) => (

                                                            <div
                                                                key={
                                                                    leave._id
                                                                }
                                                                className={`rounded-xl border p-3 ${getLeaveColor(
                                                                    leave.leaveType
                                                                )}`}
                                                            >

                                                                {/* Employee Name */}

                                                                {(
                                                                    role ===
                                                                        "ADMIN" ||
                                                                    role ===
                                                                        "SUPER_ADMIN"
                                                                ) && (
                                                                    <p className="text-sm font-bold">
                                                                        {
                                                                            leave
                                                                                .employee
                                                                                ?.fullName ||
                                                                            "Unknown Employee"
                                                                        }
                                                                    </p>
                                                                )}

                                                                {/* Leave Type */}

                                                                <p className="mt-1 text-xs font-semibold">
                                                                    {
                                                                        leave.leaveType
                                                                    }
                                                                </p>

                                                                {/* Status */}

                                                                <p className="mt-1 text-xs font-semibold text-green-600">
                                                                    Approved
                                                                </p>

                                                                {/* Reason */}

                                                                {leave.reason && (
                                                                    <p className="mt-1 text-xs opacity-70">
                                                                        {
                                                                            leave.reason
                                                                        }
                                                                    </p>
                                                                )}

                                                            </div>

                                                        )
                                                    )}

                                                </div>

                                            )}

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    )}

                </div>

                {/* Legend */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <p className="mb-3 text-sm font-semibold text-slate-700">
                        Leave Types
                    </p>

                    <div className="flex flex-wrap gap-3">

                        <Legend
                            label="Annual"
                            color="bg-blue-100 text-blue-700"
                        />

                        <Legend
                            label="Sick"
                            color="bg-red-100 text-red-700"
                        />

                        <Legend
                            label="Casual"
                            color="bg-green-100 text-green-700"
                        />

                        <Legend
                            label="Paid"
                            color="bg-purple-100 text-purple-700"
                        />

                        <Legend
                            label="Unpaid"
                            color="bg-gray-200 text-gray-700"
                        />

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

function Legend({
    label,
    color,
}) {
    return (
        <span
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${color}`}
        >
            {label}
        </span>
    );
}

export default Calendar;