import mongoose from "mongoose";

const attendanceSessionSchema =
    new mongoose.Schema(
        {
            punchIn: {
                type: Date,
                required: true,
            },

            punchOut: {
                type: Date,
                default: null,
            },
        },
        {
            _id: true,
        }
    );

const attendanceSchema =
    new mongoose.Schema(
        {
            employee: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            date: {
                type: Date,
                required: true,
            },

            sessions: {
                type: [attendanceSessionSchema],
                default: [],
            },

            workingMinutes: {
                type: Number,
                default: 0,
            },

            status: {
                type: String,
                enum: ["Present", "Absent"],
                default: "Present",
            },
        },
        {
            timestamps: true,
        }
    );

attendanceSchema.index(
    {
        employee: 1,
        date: 1,
    },
    {
        unique: true,
    }
);

const Attendance =
    mongoose.model(
        "Attendance",
        attendanceSchema
    );

export default Attendance;