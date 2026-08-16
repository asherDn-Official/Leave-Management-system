import express from "express";

import {
    punchInController,
    punchOutController,
    getTodayAttendanceController,
    getMyAttendanceController,
    getAllAttendanceController,
} from "../controllers/attendance.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// ====================================
// Punch In
// ====================================

router.post(
    "/punch-in",
    authenticateUser,
    punchInController
);

// ====================================
// Punch Out
// ====================================

router.post(
    "/punch-out",
    authenticateUser,
    punchOutController
);

// ====================================
// Get Today's Attendance
// ====================================

router.get(
    "/today",
    authenticateUser,
    getTodayAttendanceController
);

// ====================================
// Get My Attendance History
// ====================================

router.get(
    "/my",
    authenticateUser,
    getMyAttendanceController
);

// ====================================
// Get All Employee Attendance
// SUPER ADMIN ONLY
// ====================================

router.get(
    "/all",
    authenticateUser,
    authorizeRoles("SUPER_ADMIN"),
    getAllAttendanceController
);

export default router;