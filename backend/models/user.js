import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
        trim: true
        },
    password:{
        type: String,
        required: true,
        trim: true,
        select: false
        },
    role:{
        type: String,
        enum: ["SUPER_ADMIN","ADMIN","USER"],
        required: true
        },
    isActive:{
        type: Boolean,
        default: true
        },
    lastLogin:{
        type: Date
        }    
    },
    {
        timestamps: true
    }
);
const User = mongoose.model("User", userSchema);
export default User;