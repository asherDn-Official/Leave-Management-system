import {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    getPendingLeaves,
    approveLeave,
    rejectLeave,
    cancelLeave
} from "../services/leave.service.js";


// --------------------------------------------------
// Apply Leave
// --------------------------------------------------

export const applyLeaveController = async (
    req,
    res
) => {

    try {

        const {
            leaveType,
            startDate,
            endDate,
            totalDays,
            reason
        } = req.body;

        const leave =
            await applyLeave({
                employee: req.user.id,
                leaveType,
                startDate,
                endDate,
                totalDays,
                reason
            });

        return res.status(201).json({
            success: true,
            message:
                "Leave applied successfully.",
            data: leave
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// --------------------------------------------------
// Get Logged-in User Leaves
// --------------------------------------------------

export const getMyLeavesController = async (
    req,
    res
) => {

    try {

        const leaves =
            await getMyLeaves(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Leaves fetched successfully.",
            data: leaves
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// --------------------------------------------------
// Get All Leaves
// --------------------------------------------------

export const getAllLeavesController = async (
    req,
    res
) => {

    try {

        const leaves =
            await getAllLeaves();

        return res.status(200).json({
            success: true,
            message:
                "All leave requests fetched successfully.",
            data: leaves
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// --------------------------------------------------
// Get Pending Leaves
// --------------------------------------------------

export const getPendingLeavesController = async (
    req,
    res
) => {

    try {

        const leaves =
            await getPendingLeaves(
                req.user.role
            );

        return res.status(200).json({
            success: true,
            message:
                "Pending leave requests fetched successfully.",
            data: leaves
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// --------------------------------------------------
// Approve Leave
// --------------------------------------------------

export const approveLeaveController = async (
    req,
    res
) => {

    try {

        const { leaveId } =
            req.params;

        const leave =
            await approveLeave(
                leaveId,
                req.user.id,
                req.user.role
            );

        return res.status(200).json({
            success: true,
            message:
                "Leave approved successfully.",
            data: leave
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// --------------------------------------------------
// Reject Leave
// --------------------------------------------------

export const rejectLeaveController = async (
    req,
    res
) => {

    try {

        const { leaveId } =
            req.params;

        const {
            rejectionReason
        } = req.body;

        const leave =
            await rejectLeave(
                leaveId,
                req.user.id,
                req.user.role,
                rejectionReason
            );

        return res.status(200).json({
            success: true,
            message:
                "Leave rejected successfully.",
            data: leave
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// --------------------------------------------------
// Cancel Leave
// --------------------------------------------------

export const cancelLeaveController = async (
    req,
    res
) => {

    try {

        const { leaveId } =
            req.params;

        const leave =
            await cancelLeave(
                leaveId,
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Leave cancelled successfully.",
            data: leave
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};