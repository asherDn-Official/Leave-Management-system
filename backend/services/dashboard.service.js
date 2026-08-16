import User from "../models/user.js";
import Leave from "../models/leave.model.js";
import PendingRegistration from "../models/pendingRegistration.js";

export const getDashboardStats = async (user) => {
    const role = user.role;

    // USER Dashboard
    if (role === "USER") {
        const totalLeaves = await Leave.countDocuments({
            employee: user.id,
        });

        const pendingLeaves = await Leave.countDocuments({
            employee: user.id,
            status: "Pending",
        });

        const approvedLeaves = await Leave.countDocuments({
            employee: user.id,
            status: "Approved",
        });

        const rejectedLeaves = await Leave.countDocuments({
            employee: user.id,
            status: "Rejected",
        });

        return {
            totalLeaves,
            pendingLeaves,
            approvedLeaves,
            rejectedLeaves,
        };
    }

    // ADMIN Dashboard
    if (role === "ADMIN") {
        const totalEmployees = await User.countDocuments();

        const pendingLeaves = await Leave.countDocuments({
            status: "Pending",
        });

        const approvedLeaves = await Leave.countDocuments({
            status: "Approved",
        });

        const rejectedLeaves = await Leave.countDocuments({
            status: "Rejected",
        });

        return {
            totalEmployees,
            pendingLeaves,
            approvedLeaves,
            rejectedLeaves,
        };
    }

    // SUPER_ADMIN Dashboard
    if (role === "SUPER_ADMIN") {
        const totalEmployees = await User.countDocuments();

        const pendingRegistrations =
            await PendingRegistration.countDocuments({
                status: "Pending",
            });

        const pendingLeaves = await Leave.countDocuments({
            status: "Pending",
        });

        const approvedLeaves = await Leave.countDocuments({
            status: "Approved",
        });

        const rejectedLeaves = await Leave.countDocuments({
            status: "Rejected",
        });

        return {
            totalEmployees,
            pendingRegistrations,
            pendingLeaves,
            approvedLeaves,
            rejectedLeaves,
        };
    }

    throw new Error("Invalid role.");
};