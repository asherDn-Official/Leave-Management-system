import {
    getLeaveBalance,
    getAllLeaveBalances,
    updateLeaveBalance
} from "../services/leaveBalance.service.js";


// Employee gets own balance
export const getMyLeaveBalanceController = async (
    req,
    res
) => {

    try {

        const balance =
            await getLeaveBalance(req.user.id);

        if (!balance) {
            return res.status(404).json({
                success: false,
                message: "Leave balance has not been assigned yet."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Leave balance fetched successfully.",
            data: balance
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Super Admin gets everyone's balance
export const getAllLeaveBalancesController = async (
    req,
    res
) => {

    try {

        const balances =
            await getAllLeaveBalances();

        return res.status(200).json({
            success: true,
            message: "Leave balances fetched successfully.",
            data: balances
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Super Admin updates employee balance
export const updateLeaveBalanceController = async (
    req,
    res
) => {

    try {

        const { employeeId } =
            req.params;

        const {
            casualLeave,
            sickLeave,
            earnedLeave
        } = req.body;

        const balance =
            await updateLeaveBalance(
                employeeId,
                {
                    casualLeave,
                    sickLeave,
                    earnedLeave
                }
            );

        return res.status(200).json({
            success: true,
            message: "Leave balance updated successfully.",
            data: balance
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};