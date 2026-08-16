import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import {
    CalendarDays,
    ClipboardList,
    Clock3,
    CheckCircle2,
    UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";

function Home() {
    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const [leaves, setLeaves] = useState([]);
    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [pendingRegistrations, setPendingRegistrations] = useState([]);
    const [attendance, setAttendance] = useState(null);

    const [loadingLeaves, setLoadingLeaves] = useState(true);
    const [loadingAttendance, setLoadingAttendance] = useState(true);
    const [loadingDashboard, setLoadingDashboard] = useState(true);
    const [attendanceLoading, setAttendanceLoading] = useState(false);

    const today = new Date();

    const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    // ====================================
    // Fetch Home Page Data
    // ====================================

    useEffect(() => {
        fetchHomeData();
        fetchTodayAttendance();
    }, []);

    // ====================================
    // Fetch Leaves / Admin Data
    // ====================================

    const fetchHomeData = async () => {
        try {
            // Everyone needs their own leave history
            const myLeavesResponse = await api.get(
                "/leaves/my-leaves"
            );

            setLeaves(
                myLeavesResponse.data?.data || []
            );

            // Admin and Super Admin need pending approvals
            if (
                user.role === "ADMIN" ||
                user.role === "SUPER_ADMIN"
            ) {
                const pendingLeavesResponse =
                    await api.get(
                        "/leaves/pending"
                    );

                setPendingApprovals(
                    pendingLeavesResponse.data?.data || []
                );
            }

            // Super Admin has pending registrations
            if (user.role === "SUPER_ADMIN") {
                const pendingRegistrationsResponse =
                    await api.get(
                        "/super-admin/pending-registrations"
                    );

                setPendingRegistrations(
                    pendingRegistrationsResponse.data?.data || []
                );
            }

        } catch (error) {
            console.error(
                "Failed to fetch Home data:",
                error.response?.data || error
            );
        } finally {
            setLoadingLeaves(false);
            setLoadingDashboard(false);
        }
    };

    // ====================================
    // Fetch Today's Attendance
    // ====================================

    const fetchTodayAttendance = async () => {
        try {
            const response = await api.get(
                "/attendance/today"
            );

            setAttendance(
                response.data?.data || null
            );

        } catch (error) {
            console.error(
                "Failed to fetch attendance:",
                error.response?.data || error
            );
        } finally {
            setLoadingAttendance(false);
        }
    };

    // ====================================
    // Punch In
    // ====================================

    const handlePunchIn = async () => {
        try {
            setAttendanceLoading(true);

            const response = await api.post(
                "/attendance/punch-in"
            );

            setAttendance(
                response.data.data
            );

            toast.success(
                response.data.message
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to punch in."
            );

        } finally {
            setAttendanceLoading(false);
        }
    };

    // ====================================
    // Punch Out
    // ====================================

    const handlePunchOut = async () => {
        try {
            setAttendanceLoading(true);

            const response = await api.post(
                "/attendance/punch-out"
            );

            setAttendance(
                response.data.data
            );

            toast.success(
                response.data.message
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to punch out."
            );

        } finally {
            setAttendanceLoading(false);
        }
    };

    // ====================================
    // Attendance Session Helpers
    // ====================================

    const sessions =
        attendance?.sessions || [];

    /*
     * A session is active when it has
     * a Punch In but no Punch Out.
     */

    const activeSession =
        sessions.find(
            (session) =>
                session.punchIn &&
                !session.punchOut
        );

    /*
     * First Punch In of the day.
     */

    const firstPunchIn =
        sessions.length > 0
            ? sessions[0]?.punchIn
            : null;

    /*
     * Last completed Punch Out.
     *
     * We search from the end because the
     * latest completed session represents
     * the last Punch Out of the day.
     */

    const completedSessions =
        sessions.filter(
            (session) =>
                session.punchIn &&
                session.punchOut
        );

    const lastPunchOut =
        completedSessions.length > 0
            ? completedSessions[
                  completedSessions.length - 1
              ]?.punchOut
            : null;

    const hasPunchedIn =
        Boolean(firstPunchIn);

    const isCurrentlyPunchedIn =
        Boolean(activeSession);

    // ====================================
    // Format Time
    // ====================================

    const formatTime = (date) => {
        if (!date) {
            return "--";
        }

        return new Date(date).toLocaleTimeString(
            "en-US",
            {
                hour: "numeric",
                minute: "2-digit",
            }
        );
    };

    // ====================================
    // Format Working Minutes
    // ====================================

    const formatWorkingTime = (
        minutes = 0
    ) => {
        const hours = Math.floor(
            minutes / 60
        );

        const remainingMinutes =
            minutes % 60;

        return `${hours}h ${remainingMinutes}m`;
    };

    // ====================================
    // Leave Statistics
    // ====================================

    const pendingLeaves = leaves.filter(
        (leave) =>
            leave.status === "Pending"
    );

    const approvedLeaves = leaves.filter(
        (leave) =>
            leave.status === "Approved"
    );

    // ====================================
    // Upcoming Approved Leaves
    // ====================================

    const upcomingLeaves =
        approvedLeaves
            .filter((leave) => {
                if (!leave.startDate) {
                    return false;
                }

                const startDate = new Date(
                    leave.startDate
                );

                return (
                    startDate >=
                    new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        today.getDate()
                    )
                );
            })
            .sort(
                (a, b) =>
                    new Date(a.startDate) -
                    new Date(b.startDate)
            )
            .slice(0, 3);

    // ====================================
    // Current Week
    // ====================================

    const getWeekDates = () => {
        const current = new Date();

        return Array.from(
            { length: 7 },
            (_, index) => {
                const date = new Date(current);

                date.setDate(
                    current.getDate() + index
                );

                return date;
            }
        );
    };

    const weekDates =
        getWeekDates();

    // ====================================
    // Format Date
    // ====================================

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

    // ====================================
    // Normalize Date
    // ====================================

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

    // ====================================
    // Check Approved Leave
    // ====================================

    const isOnLeave = (date) => {
        const targetDate =
            formatDate(date);

        return approvedLeaves.some(
            (leave) => {
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
            }
        );
    };

    // ====================================
    // Check Today
    // ====================================

    const isToday = (date) => {
        return (
            formatDate(date) ===
            formatDate(new Date())
        );
    };

    // ====================================
    // Check Past
    // ====================================

    const isPast = (date) => {
        return (
            formatDate(date) <
            formatDate(today)
        );
    };

    // ====================================
    // Weekly Status
    // ====================================

    const getDayStatus = (date) => {

        /*
         * Approved leave gets checked FIRST.
         *
         * This means even if the leave
         * is in the future, it will still
         * display "On Leave".
         */

        if (isOnLeave(date)) {
            return {
                label: "On Leave",
                type: "leave",
            };
        }

        // Today
        if (isToday(date)) {
            return {
                label: "Today",
                type: "today",
            };
        }

        // Future
        if (!isPast(date)) {
            return {
                label: "Upcoming",
                type: "upcoming",
            };
        }

        /*
         * Past day.
         *
         * We currently only have today's
         * attendance record available on
         * the Home page, so a past day
         * without an attendance record
         * will be treated as Absent.
         */

        return {
            label: "Absent",
            type: "absent",
        };
    };

    // ====================================
    // Status Styles
    // ====================================

    const getStatusStyles = (type) => {

        switch (type) {

            case "today":
                return {
                    dot: "bg-indigo-500",
                    text: "text-indigo-600",
                };

            case "leave":
                return {
                    dot: "bg-green-500",
                    text: "text-green-600",
                };

            case "present":
                return {
                    dot: "bg-emerald-500",
                    text: "text-emerald-600",
                };

            case "absent":
                return {
                    dot: "bg-red-500",
                    text: "text-red-600",
                };

            case "upcoming":
            default:
                return {
                    dot: "bg-slate-300",
                    text: "text-slate-400",
                };
        }
    };

    return (
        <DashboardLayout>

            <div className="space-y-6">

                {/* ================================= */}
                {/* Welcome */}
                {/* ================================= */}

                <section>

                    <p className="text-sm font-medium text-indigo-600">
                        {formattedDate}
                    </p>

                    <h1 className="mt-2 text-4xl font-bold text-slate-800">
                        Good Morning,{" "}
                        {user.fullName || "User"}
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Welcome back to your
                        AsherDn workspace.
                    </p>

                </section>

                {/* ================================= */}
                {/* Today's Attendance */}
                {/* ================================= */}

                <section className="rounded-2xl bg-white p-6 shadow-sm">

                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

                        <div className="flex-1">

                            <div className="flex items-center gap-2">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">

                                    <Clock3
                                        size={20}
                                        className="text-slate-600"
                                    />

                                </div>

                                <p className="text-sm font-medium text-slate-500">
                                    Today's Status
                                </p>

                            </div>

                            {loadingAttendance ? (

                                <h2 className="mt-4 text-2xl font-semibold text-slate-800">
                                    Loading...
                                </h2>

                            ) : !hasPunchedIn ? (

                                <>
                                    <h2 className="mt-4 text-2xl font-semibold text-slate-800">
                                        Away
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        You haven't punched
                                        in today.
                                    </p>
                                </>

                            ) : (

                                <>
                                    <h2 className="mt-4 text-2xl font-semibold text-green-600">
                                        Present
                                    </h2>

                                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">

                                        {/* First Punch In */}

                                        <div className="rounded-xl bg-slate-50 px-4 py-3">

                                            <p className="text-xs font-medium text-slate-400">
                                                First Punch In
                                            </p>

                                            <p className="mt-1 text-lg font-semibold text-slate-800">
                                                {formatTime(
                                                    firstPunchIn
                                                )}
                                            </p>

                                        </div>

                                        {/* Last Punch Out */}

                                        <div className="rounded-xl bg-slate-50 px-4 py-3">

                                            <p className="text-xs font-medium text-slate-400">
                                                Last Punch Out
                                            </p>

                                            <p className="mt-1 text-lg font-semibold text-slate-800">
                                                {formatTime(
                                                    lastPunchOut
                                                )}
                                            </p>

                                        </div>

                                        {/* Total Worked */}

                                        <div className="rounded-xl bg-slate-50 px-4 py-3">

                                            <p className="text-xs font-medium text-slate-400">
                                                Total Worked
                                            </p>

                                            <p className="mt-1 text-lg font-semibold text-slate-800">
                                                {formatWorkingTime(
                                                    attendance?.workingMinutes || 0
                                                )}
                                            </p>

                                        </div>

                                    </div>

                                </>

                            )}

                        </div>

                        {!loadingAttendance && (
                            <>
                                {!hasPunchedIn ? (

                                    <button
                                        onClick={
                                            handlePunchIn
                                        }
                                        disabled={
                                            attendanceLoading
                                        }
                                        className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {attendanceLoading
                                            ? "Punching In..."
                                            : "Punch In"}
                                    </button>

                                ) : isCurrentlyPunchedIn ? (

                                    <button
                                        onClick={
                                            handlePunchOut
                                        }
                                        disabled={
                                            attendanceLoading
                                        }
                                        className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {attendanceLoading
                                            ? "Punching Out..."
                                            : "Punch Out"}
                                    </button>

                                ) : (

                                    <button
                                        onClick={
                                            handlePunchIn
                                        }
                                        disabled={
                                            attendanceLoading
                                        }
                                        className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {attendanceLoading
                                            ? "Punching In..."
                                            : "Punch In"}
                                    </button>

                                )}
                            </>
                        )}

                    </div>

                </section>

                {/* ================================= */}
                {/* Summary */}
                {/* ================================= */}

                <section>

                    <div className="mb-4">

                        <h2 className="text-xl font-semibold text-slate-800">
                            Today's Summary
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Your attendance and
                            leave overview.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                        <SummaryCard
                            icon={Clock3}
                            title="Working Hours"
                            value={
                                attendance?.workingMinutes
                                    ? formatWorkingTime(
                                        attendance.workingMinutes
                                    )
                                    : "0h 0m"
                            }
                            description={
                                isCurrentlyPunchedIn
                                    ? "Current working time"
                                    : "Today's working time"
                            }
                            iconStyle="bg-blue-100 text-blue-600"
                        />

                        <SummaryCard
                            icon={ClipboardList}
                            title={
                                user.role === "ADMIN" ||
                                user.role === "SUPER_ADMIN"
                                    ? "Pending Approvals"
                                    : "Pending Leaves"
                            }
                            value={
                                loadingDashboard
                                    ? "..."
                                    : user.role === "ADMIN" ||
                                      user.role === "SUPER_ADMIN"
                                        ? pendingApprovals.length
                                        : pendingLeaves.length
                            }
                            description={
                                user.role === "ADMIN" ||
                                user.role === "SUPER_ADMIN"
                                    ? "Leave requests awaiting approval"
                                    : "Your requests awaiting approval"
                            }
                            iconStyle="bg-orange-100 text-orange-600"
                        />

                        {user.role === "USER" ? (

                            <SummaryCard
                                icon={CheckCircle2}
                                title="Approved Leaves"
                                value={
                                    loadingLeaves
                                        ? "..."
                                        : approvedLeaves.length
                                }
                                description="Approved requests"
                                iconStyle="bg-green-100 text-green-600"
                            />

                        ) : (

                            <SummaryCard
                                icon={UserPlus}
                                title="Pending Registrations"
                                value={
                                    loadingDashboard
                                        ? "..."
                                        : user.role === "SUPER_ADMIN"
                                            ? pendingRegistrations.length
                                            : "—"
                                }
                                description={
                                    user.role === "SUPER_ADMIN"
                                        ? "Registrations awaiting approval"
                                        : "Managed by Super Admin"
                                }
                                iconStyle="bg-purple-100 text-purple-600"
                            />

                        )}

                    </div>

                </section>

                {/* ================================= */}
                {/* Weekly Overview */}
                {/* ================================= */}

                <section className="rounded-2xl bg-white p-6 shadow-sm">

                    <div className="mb-6 flex items-center justify-between">

                        <div>

                            <div className="flex items-center gap-2">

                                <CalendarDays
                                    size={21}
                                    className="text-indigo-600"
                                />

                                <h2 className="text-xl font-semibold text-slate-800">
                                    This Week
                                </h2>

                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                                Your weekly attendance and leave overview.
                            </p>

                        </div>

                    </div>

                    {/* Week */}

                    <div className="grid grid-cols-7 gap-2 md:gap-3">

                        {weekDates.map((date) => {

                            const status =
                                getDayStatus(date);

                            const styles =
                                getStatusStyles(
                                    status.type
                                );

                            const today =
                                isToday(date);

                            return (
                                <div
                                    key={formatDate(date)}
                                    className={`relative rounded-2xl border p-3 text-center transition md:p-4 ${
                                        today
                                            ? "border-indigo-500 bg-indigo-50 shadow-sm"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                                >

                                    {today && (
                                        <div className="absolute left-1/2 top-0 h-1 w-8 -translate-x-1/2 rounded-b-full bg-indigo-600" />
                                    )}

                                    <p
                                        className={`text-xs font-semibold uppercase ${
                                            today
                                                ? "text-indigo-600"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        {date.toLocaleDateString(
                                            "en-US",
                                            {
                                                weekday: "short",
                                            }
                                        )}
                                    </p>

                                    <p
                                        className={`mt-2 text-2xl font-bold ${
                                            today
                                                ? "text-indigo-600"
                                                : "text-slate-800"
                                        }`}
                                    >
                                        {date.getDate()}
                                    </p>

                                    {/* Status */}

                                    <div className="mt-4 flex flex-col items-center gap-1">

                                        <div
                                            className={`h-2 w-2 rounded-full ${styles.dot}`}
                                        />

                                        <span
                                            className={`text-[10px] font-semibold ${styles.text}`}
                                        >
                                            {status.label}
                                        </span>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                    {/* Legend */}

                    <div className="mt-5 flex flex-wrap items-center gap-5 text-xs text-slate-500">

                        <div className="flex items-center gap-2">

                            <div className="h-2 w-2 rounded-full bg-indigo-500" />

                            <span>Today</span>

                        </div>

                        <div className="flex items-center gap-2">

                            <div className="h-2 w-2 rounded-full bg-green-500" />

                            <span>Approved Leave</span>

                        </div>

                        <div className="flex items-center gap-2">

                            <div className="h-2 w-2 rounded-full bg-red-500" />

                            <span>Absent</span>

                        </div>

                        <div className="flex items-center gap-2">

                            <div className="h-2 w-2 rounded-full bg-slate-300" />

                            <span>Upcoming</span>

                        </div>

                    </div>

                </section>

                {/* ================================= */}
                {/* Upcoming Leaves */}
                {/* ================================= */}

                <section className="rounded-2xl bg-white p-6 shadow-sm">

                    <div className="mb-5 flex items-center justify-between">

                        <div>

                            <h2 className="text-xl font-semibold text-slate-800">
                                Upcoming Leaves
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Your next approved
                                leaves.
                            </p>

                        </div>

                        <CalendarDays
                            size={22}
                            className="text-indigo-600"
                        />

                    </div>

                    {loadingLeaves ? (

                        <p className="text-sm text-slate-500">
                            Loading...
                        </p>

                    ) : upcomingLeaves.length === 0 ? (

                        <div className="rounded-xl bg-slate-50 p-6 text-center">

                            <p className="text-sm text-slate-500">
                                No upcoming approved
                                leaves.
                            </p>

                        </div>

                    ) : (

                        <div className="space-y-3">

                            {upcomingLeaves.map(
                                (leave) => (

                                    <div
                                        key={leave._id}
                                        className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center"
                                    >

                                        <div>

                                            <p className="font-semibold text-slate-800">
                                                {leave.leaveType}
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">

                                                {new Date(
                                                    leave.startDate
                                                ).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    }
                                                )}

                                                {" - "}

                                                {new Date(
                                                    leave.endDate
                                                ).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    }
                                                )}

                                            </p>

                                        </div>

                                        <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                            Approved
                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

            </div>

        </DashboardLayout>
    );
}

// ====================================
// Summary Card
// ====================================

function SummaryCard({
    icon: Icon,
    title,
    value,
    description,
    iconStyle,
}) {
    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-800">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        {description}
                    </p>

                </div>

                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconStyle}`}
                >
                    <Icon size={21} />
                </div>

            </div>

        </div>
    );
}

export default Home;