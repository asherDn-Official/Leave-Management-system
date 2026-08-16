import express from "express";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

import { getEmployeesController } from "../controllers/user.controller.js";

const router = express.Router();

router.get(
    "/employees",
    authenticateUser,
    authorizeRoles("SUPER_ADMIN", "ADMIN"),
    getEmployeesController
);

export default router;