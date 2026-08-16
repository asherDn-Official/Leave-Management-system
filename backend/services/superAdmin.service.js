import mongoose from "mongoose";
import PendingRegistration from "../models/pendingRegistration.js";
import User from "../models/user.js";

export const getPendingRegistrations = async () => {
    const pendingRegistrations = await PendingRegistration.find(
       {status: "Pending"},
       {password: 0}
    );
    return pendingRegistrations;
};

export const approveRegistration = async (id,role)=> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid registration ID.");
}
    const pendingRegistration = await PendingRegistration.findById(id);
    if(!pendingRegistration){
        throw new Error("Pending registration not found.")
    }
    if(pendingRegistration.status !== "Pending"){
        throw new Error("Only pending registrations can be approved.");
    }
    const allowedRoles = ["ADMIN", "USER"];

    if (!allowedRoles.includes(role)) {
    throw new Error("Invalid role. Role must be either ADMIN or USER.");
    }

    const user= await User.create({
        employeeId: pendingRegistration.employeeId,
        fullName: pendingRegistration.fullName,
        email: pendingRegistration.email,
        phoneNumber: pendingRegistration.phoneNumber,
        designation: pendingRegistration.designation,
        password: pendingRegistration.password,
        role: role
    });
    pendingRegistration.status = "Approved";
    await pendingRegistration.save();
    return {
        employeeId: user.employeeId,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        designation: user.designation,
        role: user.role,
        isActive: user.isActive
    };
};

export const rejectRegistration = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid registration ID.");
}
    const pendingRegistration = await PendingRegistration.findById(id);
    if(!pendingRegistration){
        throw new Error("Pending registration not found.");
    }
    if(pendingRegistration.status !== "Pending"){
        throw new Error("Only pending registrations can be rejected.");
    }

    pendingRegistration.status= "Rejected";
    await pendingRegistration.save();
    return pendingRegistration;
};