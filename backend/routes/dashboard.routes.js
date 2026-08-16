
import express from "express";

import { getDashboardStatsController } from "../controllers/dashboard.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
    "/stats",
    authenticateUser,
    authorizeRoles("USER", "ADMIN", "SUPER_ADMIN"),
    getDashboardStatsController
);

export default router;

