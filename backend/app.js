import express from "express";
import cors from "cors";
import registrationRoutes from "./routes/registration.routes.js";
import superAdminRoutes from "./routes/superAdmin.routes.js";
import loginRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import leaveRoutes from "./routes/leave.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import leaveBalanceRoutes from "./routes/leaveBalance.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api",registrationRoutes);
app.use("/api/super-admin",superAdminRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api", userRoutes);
app.use("/api/leaves", leaveRoutes);
app.use(
    "/api/attendance",
    attendanceRoutes
);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/leave-balances",
leaveBalanceRoutes
);

app.get("/", (req,res) =>{
    res.status(200).json({
        success: true,
        message: "Leave management API is running."
    });
});
export default app;
