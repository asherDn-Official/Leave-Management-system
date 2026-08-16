import Leave from "../models/leave.model.js";
import LeaveBalance from "../models/leaveBalance.model.js";
import User from "../models/user.js";

const DEFAULT_LEAVE_BALANCE = {
    casualLeave: {
        total: 12,
        used: 0,
        remaining: 12
    },

    sickLeave: {
        total: 12,
        used: 0,
        remaining: 12
    },

    earnedLeave: {
        total: 15,
        used: 0,
        remaining: 15
    }
};

const getBalanceCategory = (leaveType) => {
    switch (leaveType) {
        case "Casual Leave":
            return "casualLeave";

        case "Sick Leave":
            return "sickLeave";

        case "Earned Leave":
            return "earnedLeave";

        default:
            throw new Error("Invalid leave type.");
    }
};

const getOrCreateLeaveBalance = async (
    employeeId
) => {
    const currentYear =
        new Date().getFullYear();

    let leaveBalance =
        await LeaveBalance.findOne({
            employee: employeeId,
            year: currentYear
        });

    if (leaveBalance) {
        return leaveBalance;
    }

    const employee =
        await User.findById(employeeId);

    if (!employee) {
        throw new Error(
            "Employee not found."
        );
    }

    leaveBalance =
        await LeaveBalance.create({
            employee: employeeId,
            year: currentYear,

            casualLeave: {
                total:
                    DEFAULT_LEAVE_BALANCE
                        .casualLeave.total,
                used: 0,
                remaining:
                    DEFAULT_LEAVE_BALANCE
                        .casualLeave.total
            },

            sickLeave: {
                total:
                    DEFAULT_LEAVE_BALANCE
                        .sickLeave.total,
                used: 0,
                remaining:
                    DEFAULT_LEAVE_BALANCE
                        .sickLeave.total
            },

            earnedLeave: {
                total:
                    DEFAULT_LEAVE_BALANCE
                        .earnedLeave.total,
                used: 0,
                remaining:
                    DEFAULT_LEAVE_BALANCE
                        .earnedLeave.total
            }
        });

    return leaveBalance;
};

export const applyLeave = async (
    leaveData
) => {
    const {
        employee,
        leaveType,
        totalDays
    } = leaveData;

    const leaveBalance =
        await getOrCreateLeaveBalance(
            employee
        );

    const balanceCategory =
        getBalanceCategory(
            leaveType
        );

    const available =
        leaveBalance[
            balanceCategory
        ].remaining;

    if (totalDays > available) {
        throw new Error(
            `Insufficient ${leaveType} balance. Available: ${available} day(s).`
        );
    }

    const leave =
        await Leave.create(
            leaveData
        );

    return await leave.populate(
        "employee",
        "employeeId fullName email designation role"
    );
};

export const getMyLeaves = async (
    employeeId
) => {
    return await Leave.find({
        employee: employeeId
    })
        .sort({
            createdAt: -1
        })
        .populate(
            "approvedBy",
            "employeeId fullName role"
        )
        .populate(
            "cancelledBy",
            "employeeId fullName role"
        );
};

export const getAllLeaves = async () => {
    return await Leave.find()
        .sort({
            createdAt: -1
        })
        .populate(
            "employee",
            "employeeId fullName email designation role"
        )
        .populate(
            "approvedBy",
            "employeeId fullName role"
        )
        .populate(
            "cancelledBy",
            "employeeId fullName role"
        );
};

export const getPendingLeaves = async (
    requesterRole
) => {
    const leaves =
        await Leave.find({
            status: "Pending"
        })
            .sort({
                createdAt: -1
            })
            .populate(
                "employee",
                "employeeId fullName email designation role"
            );

    if (requesterRole === "ADMIN") {
        return leaves.filter(
            (leave) =>
                leave.employee?.role === "USER"
        );
    }

    if (
        requesterRole === "SUPER_ADMIN"
    ) {
        return leaves.filter(
            (leave) =>
                leave.employee?.role === "USER" ||
                leave.employee?.role === "ADMIN"
        );
    }

    return [];
};

export const approveLeave = async (
    leaveId,
    approverId,
    approverRole
) => {
    const leave =
        await Leave.findById(
            leaveId
        ).populate(
            "employee",
            "employeeId fullName email designation role"
        );

    if (!leave) {
        throw new Error(
            "Leave request not found."
        );
    }

    if (leave.status !== "Pending") {
        throw new Error(
            `Leave request has already been ${leave.status.toLowerCase()}.`
        );
    }

    if (
        leave.employee.role === "ADMIN" &&
        approverRole !== "SUPER_ADMIN"
    ) {
        throw new Error(
            "Only a Super Admin can approve an Admin's leave request."
        );
    }

    if (
        leave.employee.role === "SUPER_ADMIN"
    ) {
        throw new Error(
            "A Super Admin's leave request cannot be approved."
        );
    }

    const currentYear =
        new Date().getFullYear();

    const leaveBalance =
        await getOrCreateLeaveBalance(
            leave.employee._id
        );

    const balanceCategory =
        getBalanceCategory(
            leave.leaveType
        );

    const category =
        leaveBalance[
            balanceCategory
        ];

    if (
        category.remaining <
        leave.totalDays
    ) {
        throw new Error(
            `Insufficient ${leave.leaveType} balance. Available: ${category.remaining} day(s).`
        );
    }

    category.used +=
        leave.totalDays;

    category.remaining -=
        leave.totalDays;

    leave.status = "Approved";
    leave.approvedBy =
        approverId;
    leave.rejectionReason = "";

    await leaveBalance.save();
    await leave.save();

    return await Leave.findById(
        leave._id
    )
        .populate(
            "employee",
            "employeeId fullName email designation role"
        )
        .populate(
            "approvedBy",
            "employeeId fullName role"
        );
};

export const rejectLeave = async (
    leaveId,
    approverId,
    approverRole,
    rejectionReason
) => {
    const leave =
        await Leave.findById(
            leaveId
        ).populate(
            "employee",
            "employeeId fullName email designation role"
        );

    if (!leave) {
        throw new Error(
            "Leave request not found."
        );
    }

    if (leave.status !== "Pending") {
        throw new Error(
            `Leave request has already been ${leave.status.toLowerCase()}.`
        );
    }

    if (
        leave.employee.role === "ADMIN" &&
        approverRole !== "SUPER_ADMIN"
    ) {
        throw new Error(
            "Only a Super Admin can reject an Admin's leave request."
        );
    }

    if (
        leave.employee.role === "SUPER_ADMIN"
    ) {
        throw new Error(
            "A Super Admin's leave request cannot be rejected."
        );
    }

    leave.status = "Rejected";
    leave.approvedBy =
        approverId;
    leave.rejectionReason =
        rejectionReason || "";

    await leave.save();

    return await Leave.findById(
        leave._id
    )
        .populate(
            "employee",
            "employeeId fullName email designation role"
        )
        .populate(
            "approvedBy",
            "employeeId fullName role"
        );
};

export const cancelLeave = async (
    leaveId,
    employeeId
) => {
    const leave =
        await Leave.findById(
            leaveId
        );

    if (!leave) {
        throw new Error(
            "Leave request not found."
        );
    }

    if (
        leave.employee.toString() !==
        employeeId.toString()
    ) {
        throw new Error(
            "You can only cancel your own leave request."
        );
    }

    if (
        leave.status === "Cancelled"
    ) {
        throw new Error(
            "Leave request has already been cancelled."
        );
    }

    if (
        leave.status === "Rejected"
    ) {
        throw new Error(
            "Rejected leave cannot be cancelled."
        );
    }

    if (
        leave.status === "Approved"
    ) {
        const leaveBalance =
            await getOrCreateLeaveBalance(
                leave.employee
            );

        const balanceCategory =
            getBalanceCategory(
                leave.leaveType
            );

        const category =
            leaveBalance[
                balanceCategory
            ];

        category.used -=
            leave.totalDays;

        category.remaining +=
            leave.totalDays;

        if (category.used < 0) {
            category.used = 0;
        }

        if (
            category.remaining >
            category.total
        ) {
            category.remaining =
                category.total;
        }

        await leaveBalance.save();
    }

    leave.status = "Cancelled";
    leave.cancelledAt =
        new Date();
    leave.cancelledBy =
        employeeId;

    await leave.save();

    return await Leave.findById(
        leave._id
    )
        .populate(
            "employee",
            "employeeId fullName email designation role"
        )
        .populate(
            "approvedBy",
            "employeeId fullName role"
        )
        .populate(
            "cancelledBy",
            "employeeId fullName role"
        );
};