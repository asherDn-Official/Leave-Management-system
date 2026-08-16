import mongoose from "mongoose";

const leaveCategorySchema = new mongoose.Schema(
    {
        total: {
            type: Number,
            default: 0,
            min: 0
        },

        used: {
            type: Number,
            default: 0,
            min: 0
        },

        remaining: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        _id: false
    }
);

const leaveBalanceSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        year: {
            type: Number,
            required: true
        },

        casualLeave: {
            type: leaveCategorySchema,
            default: () => ({})
        },

        sickLeave: {
            type: leaveCategorySchema,
            default: () => ({})
        },

        earnedLeave: {
            type: leaveCategorySchema,
            default: () => ({})
        }
    },
    {
        timestamps: true
    }
);

const LeaveBalance = mongoose.model(
    "LeaveBalance",
    leaveBalanceSchema
);

export default LeaveBalance;