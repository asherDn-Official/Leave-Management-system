
import { getDashboardStats } from "../services/dashboard.service.js";

export const getDashboardStatsController = async (req, res) => {
    try {
        const stats = await getDashboardStats(req.user);

        return res.status(200).json({
            success: true,
            message: "Dashboard statistics fetched successfully.",
            data: stats,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

