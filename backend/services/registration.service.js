import bcrypt from "bcryptjs";
import PendingRegistration from "../models/pendingRegistration.js";

export const registerEmployee = async (employeeData) => {
     const {
        employeeId,
        fullName,
        email,
        phoneNumber,
        designation,
        password
    } = employeeData;

    const existingEmployee = await PendingRegistration.findOne({
        employeeId
    });
    if(existingEmployee) {
        throw new Error("Employee ID already exists.");
    }

    const existingEmail = await PendingRegistration.findOne({
        email
    });
    if(existingEmail) {
        throw new Error("Email already exists.");
    }

    const existingPhone = await PendingRegistration.findOne({
        phoneNumber
    });
    if(existingPhone) {
        throw new Error("Phone number already exists.");
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const newRegistration = await PendingRegistration.create({
        employeeId,
        fullName,
        email,
        phoneNumber,
        designation,
        password: hashedPassword
    });

    return {
        employeeId: newRegistration.employeeId,
        fullName: newRegistration.fullName,
        email:newRegistration.email,
        phoneNumber: newRegistration.phoneNumber,
        designation:newRegistration.designation,
        status: newRegistration.status
    };
};