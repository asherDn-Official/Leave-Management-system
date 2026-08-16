import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import connectDB from "../config/database.js";
import User from "../models/user.js";

dotenv.config();

const seedSuperAdmin = async () => {
    try{
    await connectDB();
    const existingSuperAdmin = await User.findOne({
        role: "SUPER_ADMIN"
    });
    if (existingSuperAdmin) {
    console.log("Super Admin already exists.");
    return;
}

    const hashedPassword= await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD,10);
    const superAdminLogin= await User.create({
        employeeId: process.env.SUPER_ADMIN_EMPLOYEE_ID,
        fullName: "Super Admin",
        email: process.env.SUPER_ADMIN_EMAIL,
        phoneNumber: "0000000000",
        designation: "CEO",
        password: hashedPassword,
        role: "SUPER_ADMIN"
    });
    console.log("Super Admin created successfully.");
}catch(error){
    console.error("Failed to seed Super Admin.");
    console.error(error.message);
} finally{
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
}
};
seedSuperAdmin();