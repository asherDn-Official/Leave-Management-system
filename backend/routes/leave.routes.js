import express from "express";

import {
    applyLeaveController,
    getMyLeavesController,
    getAllLeavesController,
    getPendingLeavesController,
    approveLeaveController,
    rejectLeaveController,
    cancelLeaveController
} from "../controllers/leave.controller.js";

import {
    authenticateUser
} from "../middlewares/auth.middleware.js";

import {
    authorizeRoles
} from "../middlewares/role.middleware.js";

const router = express.Router();


// --------------------------------------------------
// Apply Leave
// --------------------------------------------------

router.post(
    "/apply",
    authenticateUser,
    authorizeRoles(
        "USER",
        "ADMIN",
        "SUPER_ADMIN"
    ),
    applyLeaveController
);


// --------------------------------------------------
// Get Logged-in User Leave History
// --------------------------------------------------

router.get(
    "/my-leaves",
    authenticateUser,
    authorizeRoles(
        "USER",
        "ADMIN",
        "SUPER_ADMIN"
    ),
    getMyLeavesController
);


// --------------------------------------------------
// Get All Leave Requests
// --------------------------------------------------

router.get(
    "/all",
    authenticateUser,
    authorizeRoles(
        "ADMIN",
        "SUPER_ADMIN"
    ),
    getAllLeavesController
);


// --------------------------------------------------
// Get Pending Leave Requests
// --------------------------------------------------

router.get(
    "/pending",
    authenticateUser,
    authorizeRoles(
        "ADMIN",
        "SUPER_ADMIN"
    ),
    getPendingLeavesController
);


// --------------------------------------------------
// Approve Leave
// --------------------------------------------------

router.put(
    "/approve/:leaveId",
    authenticateUser,
    authorizeRoles(
        "ADMIN",
        "SUPER_ADMIN"
    ),
    approveLeaveController
);


// --------------------------------------------------
// Reject Leave
// --------------------------------------------------

router.put(
    "/reject/:leaveId",
    authenticateUser,
    authorizeRoles(
        "ADMIN",
        "SUPER_ADMIN"
    ),
    rejectLeaveController
);


// --------------------------------------------------
// Cancel Own Leave
// --------------------------------------------------

router.put(
    "/cancel/:leaveId",
    authenticateUser,
    authorizeRoles(
        "USER",
        "ADMIN",
        "SUPER_ADMIN"
    ),
    cancelLeaveController
);


export default router;