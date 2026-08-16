import express from "express";

import {
    getMyLeaveBalanceController,
    getAllLeaveBalancesController,
    updateLeaveBalanceController
} from "../controllers/leaveBalance.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();


// Logged-in employee
router.get(
    "/my",
    authenticateUser,
    authorizeRoles(
        "USER",
        "ADMIN",
        "SUPER_ADMIN"
    ),
    getMyLeaveBalanceController
);


// Super Admin only
router.get(
    "/all",
    authenticateUser,
    authorizeRoles("SUPER_ADMIN"),
    getAllLeaveBalancesController
);


// Super Admin only
router.put(
    "/:employeeId",
    authenticateUser,
    authorizeRoles("SUPER_ADMIN"),
    updateLeaveBalanceController
);

export default router;