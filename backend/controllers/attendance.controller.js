import {
    punchIn,
    punchOut,
    getTodayAttendance,
    getMyAttendance,
    getAllAttendance,
} from "../services/attendance.service.js";

// ====================================
// Punch In
// ====================================

export const punchInController = async (
    req,
    res
) => {
    try {
        const attendance =
            await punchIn(
                req.user.id
            );

        return res.status(201).json({
            success: true,
            message:
                "Punched in successfully.",
            data: attendance,
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// ====================================
// Punch Out
// ====================================

export const punchOutController = async (
    req,
    res
) => {
    try {
        const attendance =
            await punchOut(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Punched out successfully.",
            data: attendance,
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// ====================================
// Get Today's Attendance
// ====================================

export const getTodayAttendanceController =
    async (req, res) => {
        try {

            const attendance =
                await getTodayAttendance(
                    req.user.id
                );

            return res.status(200).json({
                success: true,
                message:
                    "Today's attendance fetched successfully.",
                data: attendance,
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

// ====================================
// Get My Attendance History
// ====================================

export const getMyAttendanceController =
    async (req, res) => {
        try {

            const attendance =
                await getMyAttendance(
                    req.user.id
                );

            return res.status(200).json({
                success: true,
                message:
                    "Attendance history fetched successfully.",
                data: attendance,
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

// ====================================
// Get All Employee Attendance
// ====================================

export const getAllAttendanceController =
    async (req, res) => {
        try {

            const attendance =
                await getAllAttendance();

            return res.status(200).json({
                success: true,
                message:
                    "All employee attendance fetched successfully.",
                data: attendance,
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };