import mongoose from "mongoose";

const pendingRegistrationSchema = new mongoose.Schema(
    {
    employeeId:{
        type: String,
        required: true,
        unique: true,
        trim: true
        },
    fullName:{
        type: String,
        required: true,
        trim: true
        },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
        },
    phoneNumber:{
        type: String,
        required: true,
        unique: true,
        trim: true
        },
    designation:{
        type: String,
        required: true,
        enum:["CEO","CTO","Developer","Designer","Tester","Marketing","Intern","Finance","Manager"],
        trim: true
        },
    password:{
        type: String,
        required: true,
        trim: true
        },
    status:{
        type: String,
        enum: ["Approved","Pending","Rejected"],
        default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

const PendingRegistration = mongoose.model(
    "PendingRegistration",
    pendingRegistrationSchema
);

export default PendingRegistration;