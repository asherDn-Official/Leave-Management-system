import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

import { getPendingRegistrationsListController, approveRegistrationController, rejectRegistrationController } from "../controllers/superAdmin.controller.js";

router.get("/pending-registrations",authenticateUser,authorizeRoles("SUPER_ADMIN"),getPendingRegistrationsListController);
router.patch("/approve-registration/:id",authenticateUser,authorizeRoles("SUPER_ADMIN"),approveRegistrationController);
router.patch("/reject-registration/:id",authenticateUser,authorizeRoles("SUPER_ADMIN"),rejectRegistrationController);

export default router;