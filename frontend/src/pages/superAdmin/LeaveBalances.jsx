import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    WalletCards,
    RefreshCw,
    Save
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";


function LeaveBalances() {

    const [balances, setBalances] = useState([]);

    const [selectedEmployee, setSelectedEmployee] =
        useState("");

    const [casualLeave, setCasualLeave] =
        useState("");

    const [sickLeave, setSickLeave] =
        useState("");

    const [earnedLeave, setEarnedLeave] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);


    const token =
        localStorage.getItem("token");


    const fetchBalances = async () => {

        try {

            setLoading(true);


            const response = await fetch(
                "http://localhost:5000/api/leave-balances/all",
                {
                    method: "GET",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to fetch leave balances."
                );
            }


            setBalances(
                result.data || []
            );

        } catch (error) {

            toast.error(
                error.message ||
                "Failed to fetch leave balances."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchBalances();

    }, []);


    const handleEmployeeChange = (event) => {

        const employeeId =
            event.target.value;


        setSelectedEmployee(
            employeeId
        );


        const selectedBalance =
            balances.find(
                (balance) =>
                    balance.employee?._id === employeeId
            );


        if (selectedBalance) {

            setCasualLeave(
                selectedBalance.casualLeave?.total ?? ""
            );

            setSickLeave(
                selectedBalance.sickLeave?.total ?? ""
            );

            setEarnedLeave(
                selectedBalance.earnedLeave?.total ?? ""
            );

        } else {

            setCasualLeave("");

            setSickLeave("");

            setEarnedLeave("");
        }
    };


    const handleUpdate = async (event) => {

        event.preventDefault();


        if (!selectedEmployee) {

            toast.error(
                "Please select an employee."
            );

            return;
        }


        if (
            casualLeave === "" &&
            sickLeave === "" &&
            earnedLeave === ""
        ) {

            toast.error(
                "Please enter at least one leave balance."
            );

            return;
        }


        try {

            setSaving(true);


            const response = await fetch(
                `http://localhost:5000/api/leave-balances/${selectedEmployee}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        casualLeave:
                            casualLeave === ""
                                ? undefined
                                : Number(casualLeave),

                        sickLeave:
                            sickLeave === ""
                                ? undefined
                                : Number(sickLeave),

                        earnedLeave:
                            earnedLeave === ""
                                ? undefined
                                : Number(earnedLeave)

                    })
                }
            );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to update leave balance."
                );
            }


            toast.success(
                "Leave balance updated successfully."
            );


            setBalances((currentBalances) =>
                currentBalances.map(
                    (balance) =>
                        balance.employee?._id === selectedEmployee
                            ? result.data
                            : balance
                )
            );


            setCasualLeave(
                result.data?.casualLeave?.total ?? ""
            );

            setSickLeave(
                result.data?.sickLeave?.total ?? ""
            );

            setEarnedLeave(
                result.data?.earnedLeave?.total ?? ""
            );

        } catch (error) {

            toast.error(
                error.message ||
                "Failed to update leave balance."
            );

        } finally {

            setSaving(false);
        }
    };


    return (

        <DashboardLayout>

            <div
                className="
                    min-h-full
                    bg-[#f3f5fb]
                    p-6
                    md:p-8
                "
            >

                {/* Page Header */}

                <div
                    className="
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        md:justify-between
                        gap-4
                        mb-6
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-[#111827]
                                text-white
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <WalletCards
                                size={22}
                                strokeWidth={1.8}
                            />

                        </div>


                        <div>

                            <h1
                                className="
                                    text-2xl
                                    font-bold
                                    text-gray-900
                                "
                            >
                                Leave Balances
                            </h1>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                "
                            >
                                Manage employee leave allocations
                            </p>

                        </div>

                    </div>


                    {/* Refresh */}

                    <button
                        type="button"
                        onClick={fetchBalances}
                        disabled={loading}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            min-w-[110px]
                            h-11
                            px-4
                            rounded-lg
                            border
                            border-gray-300
                            bg-white
                            text-sm
                            font-medium
                            text-gray-700
                            shadow-sm
                            hover:bg-gray-50
                            transition
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >

                        <RefreshCw
                            size={17}
                            strokeWidth={1.8}
                            className={
                                loading
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        <span>
                            Refresh
                        </span>

                    </button>

                </div>


                {/* Assign Leave Balance */}

                <div
                    className="
                        bg-white
                        border
                        border-gray-200
                        rounded-2xl
                        shadow-sm
                        mb-6
                    "
                >

                    <div
                        className="
                            px-6
                            py-5
                            border-b
                            border-gray-200
                        "
                    >

                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-gray-900
                            "
                        >
                            Assign Leave Balance
                        </h2>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >
                            Select an employee and set their annual leave allocation.
                        </p>

                    </div>


                    <form
                        onSubmit={handleUpdate}
                        className="
                            p-6
                            space-y-6
                        "
                    >

                        {/* Employee */}

                        <div>

                            <label
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                "
                            >
                                Employee
                            </label>


                            <select
                                value={selectedEmployee}
                                onChange={
                                    handleEmployeeChange
                                }
                                className="
                                    w-full
                                    h-11
                                    px-4
                                    border
                                    border-gray-300
                                    rounded-lg
                                    bg-white
                                    text-sm
                                    text-gray-700
                                    outline-none
                                    focus:ring-2
                                    focus:ring-[#5138ee]
                                    focus:border-[#5138ee]
                                "
                            >

                                <option value="">
                                    Select employee
                                </option>


                                {balances.map(
                                    (balance) => (

                                        <option
                                            key={
                                                balance.employee?._id
                                            }
                                            value={
                                                balance.employee?._id
                                            }
                                        >
                                            {
                                                balance.employee?.fullName
                                            }
                                            {" — "}
                                            {
                                                balance.employee?.employeeId
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* Leave Inputs */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                md:grid-cols-3
                                gap-5
                            "
                        >

                            {/* Casual */}

                            <LeaveInput
                                label="Casual Leave"
                                value={casualLeave}
                                onChange={
                                    setCasualLeave
                                }
                                placeholder="12"
                            />


                            {/* Sick */}

                            <LeaveInput
                                label="Sick Leave"
                                value={sickLeave}
                                onChange={
                                    setSickLeave
                                }
                                placeholder="12"
                            />


                            {/* Earned */}

                            <LeaveInput
                                label="Earned Leave"
                                value={earnedLeave}
                                onChange={
                                    setEarnedLeave
                                }
                                placeholder="15"
                            />

                        </div>


                        {/* Update Button */}

                        <div
                            className="
                                flex
                                justify-end
                                pt-2
                            "
                        >

                            <button
                                type="submit"
                                disabled={saving}
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    min-w-[160px]
                                    h-11
                                    px-5
                                    rounded-lg
                                    bg-[#111827]
                                    text-white
                                    text-sm
                                    font-semibold
                                    whitespace-nowrap
                                    shadow-sm
                                    hover:bg-gray-800
                                    transition
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            >

                                <Save
                                    size={17}
                                    strokeWidth={1.8}
                                />

                                <span>
                                    {saving
                                        ? "Saving..."
                                        : "Update Balance"
                                    }
                                </span>

                            </button>

                        </div>

                    </form>

                </div>


                {/* Current Leave Balances */}

                <div
                    className="
                        bg-white
                        border
                        border-gray-200
                        rounded-2xl
                        shadow-sm
                        overflow-hidden
                    "
                >

                    <div
                        className="
                            px-6
                            py-5
                            border-b
                            border-gray-200
                        "
                    >

                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-gray-900
                            "
                        >
                            Current Leave Balances
                        </h2>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >
                            Annual allocation and remaining leave for employees.
                        </p>

                    </div>


                    {loading ? (

                        <div
                            className="
                                p-10
                                text-center
                                text-sm
                                text-gray-500
                            "
                        >
                            Loading leave balances...
                        </div>

                    ) : balances.length === 0 ? (

                        <div
                            className="
                                p-10
                                text-center
                                text-sm
                                text-gray-500
                            "
                        >
                            No leave balances found.
                        </div>

                    ) : (

                        <div
                            className="
                                overflow-x-auto
                            "
                        >

                            <table
                                className="
                                    w-full
                                    text-sm
                                "
                            >

                                <thead>

                                    <tr
                                        className="
                                            bg-gray-50
                                            border-b
                                            border-gray-200
                                        "
                                    >

                                        <th
                                            className="
                                                px-6
                                                py-4
                                                text-left
                                                font-semibold
                                                text-gray-600
                                            "
                                        >
                                            Employee
                                        </th>

                                        <th
                                            className="
                                                px-6
                                                py-4
                                                text-center
                                                font-semibold
                                                text-gray-600
                                            "
                                        >
                                            Casual
                                        </th>

                                        <th
                                            className="
                                                px-6
                                                py-4
                                                text-center
                                                font-semibold
                                                text-gray-600
                                            "
                                        >
                                            Sick
                                        </th>

                                        <th
                                            className="
                                                px-6
                                                py-4
                                                text-center
                                                font-semibold
                                                text-gray-600
                                            "
                                        >
                                            Earned
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {balances.map(
                                        (balance) => (

                                            <tr
                                                key={
                                                    balance._id
                                                }
                                                className="
                                                    border-b
                                                    border-gray-100
                                                    last:border-b-0
                                                    hover:bg-gray-50
                                                    transition
                                                "
                                            >

                                                <td
                                                    className="
                                                        px-6
                                                        py-4
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            font-medium
                                                            text-gray-900
                                                        "
                                                    >
                                                        {
                                                            balance.employee?.fullName
                                                        }
                                                    </p>

                                                    <p
                                                        className="
                                                            text-xs
                                                            text-gray-500
                                                            mt-1
                                                        "
                                                    >
                                                        {
                                                            balance.employee?.employeeId
                                                        }
                                                    </p>

                                                </td>


                                                <td
                                                    className="
                                                        px-6
                                                        py-4
                                                        text-center
                                                    "
                                                >

                                                    <BalanceCell
                                                        balance={
                                                            balance.casualLeave
                                                        }
                                                    />

                                                </td>


                                                <td
                                                    className="
                                                        px-6
                                                        py-4
                                                        text-center
                                                    "
                                                >

                                                    <BalanceCell
                                                        balance={
                                                            balance.sickLeave
                                                        }
                                                    />

                                                </td>


                                                <td
                                                    className="
                                                        px-6
                                                        py-4
                                                        text-center
                                                    "
                                                >

                                                    <BalanceCell
                                                        balance={
                                                            balance.earnedLeave
                                                        }
                                                    />

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </DashboardLayout>
    );
}


/* -------------------------------------------------- */
/* Leave Input Component */
/* -------------------------------------------------- */

function LeaveInput({
    label,
    value,
    onChange,
    placeholder
}) {

    return (

        <div>

            <label
                className="
                    block
                    text-sm
                    font-medium
                    text-gray-700
                    mb-2
                "
            >
                {label}
            </label>


            <input
                type="number"
                min="0"
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                placeholder={placeholder}
                className="
                    w-full
                    h-11
                    px-4
                    border
                    border-gray-300
                    rounded-lg
                    text-sm
                    text-gray-700
                    outline-none
                    focus:ring-2
                    focus:ring-[#5138ee]
                    focus:border-[#5138ee]
                "
            />

        </div>
    );
}


/* -------------------------------------------------- */
/* Balance Cell Component */
/* -------------------------------------------------- */

function BalanceCell({
    balance
}) {

    if (!balance) {

        return (

            <span
                className="
                    text-gray-400
                "
            >
                —
            </span>

        );
    }


    return (

        <div>

            <p
                className="
                    font-semibold
                    text-gray-900
                "
            >
                {balance.remaining}
            </p>

            <p
                className="
                    text-xs
                    text-gray-500
                    mt-1
                "
            >
                {balance.used} used / {balance.total} total
            </p>

        </div>

    );
}


export default LeaveBalances;