import User from "../models/user.js";

export const getEmployees = async () => {
    const employees = await User.find(
        {},
        {
            password: 0,
        }
    );

    return employees;
};