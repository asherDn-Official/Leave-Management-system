import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const loginUser = async (email,password) => {
    const user = await User.findOne(
        {
        email,
        isActive: true
    }).select("+password");
    if(!user){
        throw new Error("Invalid credentials.");
    }
    const isPasswordMatch = await bcrypt.compare(password,user.password);
    if(!isPasswordMatch){
        throw new Error("Invalid credentials.");
    }
    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
    process.env.JWT_SECRET,
    {
        expiresIn:"1d"
    }
);
    return{
        token,
        user: {
            employeeId: user.employeeId,
            fullName: user.fullName,
            email: user.email,
            designation: user.designation,
            role: user.role
        }
    };


};


