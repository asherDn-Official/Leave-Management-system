import { getEmployees } from "../services/user.service.js";

export const getEmployeesController = async (req, res) => {
    try {
        const employees = await getEmployees();

        return res.status(200).json({
            success: true,
            message: "Employees fetched successfully.",
            data: employees,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};