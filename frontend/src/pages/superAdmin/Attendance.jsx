import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import {
    Clock3,
    RefreshCw,
    Users,
    CalendarDays,
    Timer,
    Download,
} from "lucide-react";

import * as XLSX from "xlsx";

function Attendance() {
    const [attendance, setAttendance] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    // ====================================
    // Filters
    // ====================================

    const [employeeFilter, setEmployeeFilter] =
        useState("ALL");

    const [roleFilter, setRoleFilter] =
        useState("ALL");

    const [fromDate, setFromDate] =
        useState("");

    const [toDate, setToDate] =
        useState("");

    // ====================================
    // Fetch Attendance
    // ====================================

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            setRefreshing(true);

            const response =
                await api.get(
                    "/attendance/all"
                );

            const records =
                response.data?.data || [];

            const employeeAttendance =
                records.filter(
                    (record) =>
                        record.employee?.role ===
                            "USER" ||
                        record.employee?.role ===
                            "ADMIN"
                );

            setAttendance(
                employeeAttendance
            );

        } catch (error) {

            console.error(
                "Failed to fetch attendance:",
                error.response?.data || error
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };

    // ====================================
    // Format Date
    // ====================================

    const formatDate = (date) => {
        if (!date) {
            return "--";
        }

        return new Date(
            date
        ).toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            }
        );
    };

    // ====================================
    // Format Time
    // ====================================

    const formatTime = (date) => {
        if (!date) {
            return "--";
        }

        return new Date(
            date
        ).toLocaleTimeString(
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
        const hours =
            Math.floor(
                minutes / 60
            );

        const remainingMinutes =
            minutes % 60;

        return `${hours}h ${remainingMinutes}m`;
    };

    // ====================================
    // Get First Punch In
    // ====================================

    const getFirstPunchIn = (
        sessions
    ) => {
        if (
            !sessions ||
            sessions.length === 0
        ) {
            return null;
        }

        return sessions[0]?.punchIn;
    };

    // ====================================
    // Get Last Punch Out
    // ====================================

    const getLastPunchOut = (
        sessions
    ) => {
        if (
            !sessions ||
            sessions.length === 0
        ) {
            return null;
        }

        const completedSessions =
            sessions.filter(
                (session) =>
                    session.punchIn &&
                    session.punchOut
            );

        if (
            completedSessions.length === 0
        ) {
            return null;
        }

        return completedSessions[
            completedSessions.length - 1
        ]?.punchOut;
    };

    // ====================================
    // Get Unique Employees
    // ====================================

    const employees = useMemo(() => {
        const employeeMap =
            new Map();

        attendance.forEach(
            (record) => {
                const employee =
                    record.employee;

                if (
                    employee?._id &&
                    !employeeMap.has(
                        employee._id
                    )
                ) {
                    employeeMap.set(
                        employee._id,
                        employee
                    );
                }
            }
        );

        return Array.from(
            employeeMap.values()
        ).sort(
            (a, b) =>
                (a.fullName || "").localeCompare(
                    b.fullName || ""
                )
        );
    }, [attendance]);

    // ====================================
    // Apply Filters
    // ====================================

    const filteredAttendance =
        useMemo(() => {
            return attendance.filter(
                (record) => {

                    const employee =
                        record.employee;

                    // Employee Filter
                    if (
                        employeeFilter !==
                            "ALL" &&
                        employee?._id !==
                            employeeFilter
                    ) {
                        return false;
                    }

                    // Role Filter
                    if (
                        roleFilter !==
                            "ALL" &&
                        employee?.role !==
                            roleFilter
                    ) {
                        return false;
                    }

                    // Date Filter
                    if (
                        fromDate ||
                        toDate
                    ) {
                        const recordDate =
                            new Date(
                                record.date
                            );

                        const year =
                            recordDate.getFullYear();

                        const month =
                            String(
                                recordDate.getMonth() +
                                    1
                            ).padStart(
                                2,
                                "0"
                            );

                        const day =
                            String(
                                recordDate.getDate()
                            ).padStart(
                                2,
                                "0"
                            );

                        const dateString =
                            `${year}-${month}-${day}`;

                        if (
                            fromDate &&
                            dateString <
                                fromDate
                        ) {
                            return false;
                        }

                        if (
                            toDate &&
                            dateString >
                                toDate
                        ) {
                            return false;
                        }
                    }

                    return true;
                }
            );
        }, [
            attendance,
            employeeFilter,
            roleFilter,
            fromDate,
            toDate,
        ]);

    // ====================================
    // Report Statistics
    // ====================================

    const totalWorkingMinutes =
        useMemo(() => {
            return filteredAttendance.reduce(
                (
                    total,
                    record
                ) =>
                    total +
                    (
                        record.workingMinutes ||
                        0
                    ),
                0
            );
        }, [filteredAttendance]);

    const totalWorkingHours =
        Math.floor(
            totalWorkingMinutes / 60
        );

    const totalWorkingRemainingMinutes =
        totalWorkingMinutes % 60;

    const uniqueEmployees =
        new Set(
            filteredAttendance.map(
                (record) =>
                    record.employee?._id
            )
        );

    const currentlyWorking =
        filteredAttendance.filter(
            (record) =>
                record.sessions?.some(
                    (session) =>
                        session.punchIn &&
                        !session.punchOut
                )
        ).length;

    // ====================================
    // Clear Filters
    // ====================================

    const clearFilters = () => {
        setEmployeeFilter("ALL");
        setRoleFilter("ALL");
        setFromDate("");
        setToDate("");
    };

    const hasFilters =
        employeeFilter !== "ALL" ||
        roleFilter !== "ALL" ||
        fromDate !== "" ||
        toDate !== "";

    // ====================================
    // Download Excel Report
    // ====================================

    const downloadReport = () => {

       if (
    filteredAttendance.length === 0
) {
    toast.error(
        "There are no attendance records to download."
    );

    return;
}

        const reportData =
            filteredAttendance.map(
                (record) => {

                    const employee =
                        record.employee;

                    const sessions =
                        record.sessions || [];

                    const firstPunchIn =
                        getFirstPunchIn(
                            sessions
                        );

                    const lastPunchOut =
                        getLastPunchOut(
                            sessions
                        );

                    return {
                        "Date":
                            formatDate(
                                record.date
                            ),

                        "Employee ID":
                            employee?.employeeId ||
                            "--",

                        "Employee Name":
                            employee?.fullName ||
                            "--",

                        "Role":
                            employee?.role ||
                            "--",

                        "Designation":
                            employee?.designation ||
                            "--",

                        "First Punch In":
                            formatTime(
                                firstPunchIn
                            ),

                        "Last Punch Out":
                            formatTime(
                                lastPunchOut
                            ),

                        "Total Worked":
                            formatWorkingTime(
                                record.workingMinutes
                            ),
                    };
                }
            );

        // ====================================
        // Create Worksheet
        // ====================================

        const worksheet =
            XLSX.utils.json_to_sheet(
                reportData
            );

        // ====================================
        // Set Column Widths
        // ====================================

        worksheet["!cols"] = [
            { wch: 16 },
            { wch: 16 },
            { wch: 24 },
            { wch: 14 },
            { wch: 18 },
            { wch: 18 },
            { wch: 18 },
            { wch: 18 },
        ];

        // ====================================
        // Create Workbook
        // ====================================

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Working Hours"
        );

        // ====================================
        // Generate Filename
        // ====================================

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const day =
            String(
                today.getDate()
            ).padStart(
                2,
                "0"
            );

        const filename =
            `AsherDn_Working_Hours_Report_${year}-${month}-${day}.xlsx`;

        // ====================================
        // Download
        // ====================================

        XLSX.writeFile(
            workbook,
            filename
        );
    };

    return (
        <DashboardLayout>

            <div className="space-y-6">

                {/* ====================================
                    Page Header
                ==================================== */}

                <section>

                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                        <div>

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">

                                    <Clock3
                                        size={22}
                                        className="text-indigo-600"
                                    />

                                </div>

                                <div>

                                    <h1 className="text-3xl font-bold text-slate-800">
                                        Working Hours Report
                                    </h1>

                                    <p className="mt-1 text-sm text-slate-500">
                                        View and analyze employee attendance and working hours.
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">

                            <button
                                onClick={
                                    fetchAttendance
                                }
                                disabled={
                                    refreshing
                                }
                                className="
                                    inline-flex
                                    h-11
                                    min-w-[120px]
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-4
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    transition
                                    hover:bg-slate-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >

                                <RefreshCw
                                    size={17}
                                    className={
                                        refreshing
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                {refreshing
                                    ? "Refreshing..."
                                    : "Refresh"}

                            </button>

                            <button
                                onClick={
                                    downloadReport
                                }
                                disabled={
                                    loading ||
                                    filteredAttendance.length ===
                                        0
                                }
                                className="
                                    inline-flex
                                    h-11
                                    min-w-[160px]
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-green-600
                                    px-4
                                    text-sm
                                    font-medium
                                    text-white
                                    transition
                                    hover:bg-green-700
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >

                                <Download
                                    size={18}
                                />

                                Download Report

                            </button>

                        </div>

                    </div>

                </section>

                {/* ====================================
                    Filters
                ==================================== */}

                <section className="rounded-2xl bg-white p-6 shadow-sm">

                    <div className="mb-5 flex items-center gap-2">

                        <CalendarDays
                            size={20}
                            className="text-indigo-600"
                        />

                        <div>

                            <h2 className="text-lg font-semibold text-slate-800">
                                Report Filters
                            </h2>

                            <p className="text-sm text-slate-500">
                                Filter attendance records before downloading the report.
                            </p>

                        </div>

                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

                        {/* Employee */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-600">
                                Employee
                            </label>

                            <select
                                value={
                                    employeeFilter
                                }
                                onChange={(event) =>
                                    setEmployeeFilter(
                                        event.target.value
                                    )
                                }
                                className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    text-sm
                                    text-slate-700
                                    outline-none
                                    focus:border-indigo-500
                                    focus:ring-2
                                    focus:ring-indigo-100
                                "
                            >

                                <option value="ALL">
                                    All Employees
                                </option>

                                {employees.map(
                                    (
                                        employee
                                    ) => (
                                        <option
                                            key={
                                                employee._id
                                            }
                                            value={
                                                employee._id
                                            }
                                        >
                                            {
                                                employee.fullName
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                        </div>

                        {/* Role */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-600">
                                Role
                            </label>

                            <select
                                value={
                                    roleFilter
                                }
                                onChange={(event) =>
                                    setRoleFilter(
                                        event.target.value
                                    )
                                }
                                className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    text-sm
                                    text-slate-700
                                    outline-none
                                    focus:border-indigo-500
                                    focus:ring-2
                                    focus:ring-indigo-100
                                "
                            >

                                <option value="ALL">
                                    All Roles
                                </option>

                                <option value="USER">
                                    USER
                                </option>

                                <option value="ADMIN">
                                    ADMIN
                                </option>

                            </select>

                        </div>

                        {/* From Date */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-600">
                                From Date
                            </label>

                            <input
                                type="date"
                                value={
                                    fromDate
                                }
                                onChange={(event) =>
                                    setFromDate(
                                        event.target.value
                                    )
                                }
                                className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    text-sm
                                    text-slate-700
                                    outline-none
                                    focus:border-indigo-500
                                    focus:ring-2
                                    focus:ring-indigo-100
                                "
                            />

                        </div>

                        {/* To Date */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-600">
                                To Date
                            </label>

                            <input
                                type="date"
                                value={
                                    toDate
                                }
                                onChange={(event) =>
                                    setToDate(
                                        event.target.value
                                    )
                                }
                                className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    text-sm
                                    text-slate-700
                                    outline-none
                                    focus:border-indigo-500
                                    focus:ring-2
                                    focus:ring-indigo-100
                                "
                            />

                        </div>

                    </div>

                    {hasFilters && (
                        <div className="mt-4 flex justify-end">

                            <button
                                onClick={
                                    clearFilters
                                }
                                className="
                                    text-sm
                                    font-medium
                                    text-indigo-600
                                    hover:text-indigo-700
                                "
                            >
                                Clear Filters
                            </button>

                        </div>
                    )}

                </section>

                {/* ====================================
                    Summary Cards
                ==================================== */}

                <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

                    <SummaryCard
                        icon={Users}
                        title="Employees"
                        value={
                            loading
                                ? "..."
                                : uniqueEmployees.size
                        }
                        description="Employees in selected report"
                        iconStyle="bg-blue-100 text-blue-600"
                    />

                    <SummaryCard
                        icon={CalendarDays}
                        title="Attendance Days"
                        value={
                            loading
                                ? "..."
                                : filteredAttendance.length
                        }
                        description="Attendance records"
                        iconStyle="bg-purple-100 text-purple-600"
                    />

                    <SummaryCard
                        icon={Timer}
                        title="Total Worked"
                        value={
                            loading
                                ? "..."
                                : `${totalWorkingHours}h ${totalWorkingRemainingMinutes}m`
                        }
                        description="Combined working time"
                        iconStyle="bg-green-100 text-green-600"
                    />

                    <SummaryCard
                        icon={Clock3}
                        title="Currently Working"
                        value={
                            loading
                                ? "..."
                                : currentlyWorking
                        }
                        description="Active punch-in sessions"
                        iconStyle="bg-orange-100 text-orange-600"
                    />

                </section>

                {/* ====================================
                    Attendance Table
                ==================================== */}

                <section className="rounded-2xl bg-white shadow-sm">

                    <div className="border-b border-slate-200 px-6 py-5">

                        <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">

                            <div>

                                <h2 className="text-xl font-semibold text-slate-800">
                                    Attendance Records
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {filteredAttendance.length} record
                                    {filteredAttendance.length !==
                                    1
                                        ? "s"
                                        : ""}{" "}
                                    found.
                                </p>

                            </div>

                        </div>

                    </div>

                    {loading ? (

                        <div className="flex min-h-[250px] items-center justify-center">

                            <p className="text-sm text-slate-500">
                                Loading attendance...
                            </p>

                        </div>

                    ) : filteredAttendance.length ===
                      0 ? (

                        <div className="flex min-h-[250px] flex-col items-center justify-center px-6 text-center">

                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">

                                <Clock3
                                    size={25}
                                    className="text-slate-400"
                                />

                            </div>

                            <h3 className="mt-4 text-base font-semibold text-slate-700">
                                No records found
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Try changing the selected filters.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[950px]">

                                <thead>

                                    <tr className="border-b border-slate-200 bg-slate-50">

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Date
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Employee
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Role
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            First Punch In
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Last Punch Out
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Total Worked
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredAttendance.map(
                                        (
                                            record
                                        ) => {

                                            const sessions =
                                                record.sessions ||
                                                [];

                                            const firstPunchIn =
                                                getFirstPunchIn(
                                                    sessions
                                                );

                                            const lastPunchOut =
                                                getLastPunchOut(
                                                    sessions
                                                );

                                            const isCurrentlyWorking =
                                                sessions.some(
                                                    (
                                                        session
                                                    ) =>
                                                        session.punchIn &&
                                                        !session.punchOut
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        record._id
                                                    }
                                                    className="border-b border-slate-100 transition hover:bg-slate-50"
                                                >

                                                    <td className="px-6 py-4">

                                                        <p className="text-sm font-medium text-slate-700">
                                                            {formatDate(
                                                                record.date
                                                            )}
                                                        </p>

                                                    </td>

                                                    <td className="px-6 py-4">

                                                        <div>

                                                            <p className="text-sm font-semibold text-slate-800">
                                                                {
                                                                    record
                                                                        .employee
                                                                        ?.fullName
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-slate-400">
                                                                {
                                                                    record
                                                                        .employee
                                                                        ?.employeeId
                                                                }
                                                            </p>

                                                        </div>

                                                    </td>

                                                    <td className="px-6 py-4">

                                                        <span
                                                            className={`
                                                                inline-flex
                                                                rounded-full
                                                                px-3
                                                                py-1
                                                                text-xs
                                                                font-semibold
                                                                ${
                                                                    record
                                                                        .employee
                                                                        ?.role ===
                                                                    "ADMIN"
                                                                        ? "bg-purple-100 text-purple-700"
                                                                        : "bg-blue-100 text-blue-700"
                                                                }
                                                            `}
                                                        >
                                                            {
                                                                record
                                                                    .employee
                                                                    ?.role
                                                            }
                                                        </span>

                                                    </td>

                                                    <td className="px-6 py-4">

                                                        <p className="text-sm font-medium text-slate-700">
                                                            {formatTime(
                                                                firstPunchIn
                                                            )}
                                                        </p>

                                                    </td>

                                                    <td className="px-6 py-4">

                                                        <div className="flex items-center gap-2">

                                                            <p className="text-sm font-medium text-slate-700">
                                                                {formatTime(
                                                                    lastPunchOut
                                                                )}
                                                            </p>

                                                            {isCurrentlyWorking && (
                                                                <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700">
                                                                    Working
                                                                </span>
                                                            )}

                                                        </div>

                                                    </td>

                                                    <td className="px-6 py-4">

                                                        <p className="text-sm font-semibold text-slate-800">
                                                            {formatWorkingTime(
                                                                record.workingMinutes
                                                            )}
                                                        </p>

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

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
                    className={`
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        ${iconStyle}
                    `}
                >
                    <Icon size={21} />
                </div>

            </div>

        </div>
    );
}

export default Attendance;