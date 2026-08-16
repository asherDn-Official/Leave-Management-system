import Attendance from "../models/attendance.model.js";

// ====================================
// Get Start Of Day
// ====================================

const getStartOfDay = (
    date = new Date()
) => {
    const start = new Date(date);

    start.setHours(
        0,
        0,
        0,
        0
    );

    return start;
};

// ====================================
// Get Today's Attendance
// ====================================

export const getTodayAttendance = async (
    employeeId
) => {
    const startOfDay =
        getStartOfDay();

    const endOfDay =
        new Date(startOfDay);

    endOfDay.setDate(
        endOfDay.getDate() + 1
    );

    return await Attendance.findOne({
        employee: employeeId,

        date: {
            $gte: startOfDay,
            $lt: endOfDay,
        },
    }).populate(
        "employee",
        "employeeId fullName email designation role"
    );
};

// ====================================
// Calculate Total Working Minutes
// ====================================

const calculateWorkingMinutes = (
    sessions
) => {
    let totalMinutes = 0;

    for (const session of sessions) {

        if (
            !session.punchIn ||
            !session.punchOut
        ) {
            continue;
        }

        const difference =
            session.punchOut.getTime() -
            session.punchIn.getTime();

        const minutes =
            Math.floor(
                difference /
                    (1000 * 60)
            );

        totalMinutes += minutes;
    }

    return totalMinutes;
};

// ====================================
// Punch In
// ====================================

export const punchIn = async (
    employeeId
) => {
    let attendance =
        await getTodayAttendance(
            employeeId
        );

    const now = new Date();

    // ====================================
    // No attendance record exists
    // ====================================

    if (!attendance) {

        attendance =
            await Attendance.create({
                employee: employeeId,

                date:
                    getStartOfDay(now),

                sessions: [
                    {
                        punchIn: now,
                        punchOut: null,
                    },
                ],

                workingMinutes: 0,

                status: "Present",
            });

        return await Attendance.findById(
            attendance._id
        ).populate(
            "employee",
            "employeeId fullName email designation role"
        );
    }

    // ====================================
    // Attendance already exists
    // ====================================

    const sessions =
        attendance.sessions || [];

    // Find an active session
    // that has punch-in but no punch-out.

    const activeSession =
        sessions.find(
            (session) =>
                session.punchIn &&
                !session.punchOut
        );

    // ====================================
    // Prevent duplicate Punch In
    // ====================================

    if (activeSession) {

        throw new Error(
            "You are already punched in. Please punch out before punching in again."
        );
    }

    // ====================================
    // Create a new session
    // ====================================

    attendance.sessions.push({
        punchIn: now,
        punchOut: null,
    });

    attendance.workingMinutes =
        calculateWorkingMinutes(
            attendance.sessions
        );

    await attendance.save();

    return await Attendance.findById(
        attendance._id
    ).populate(
        "employee",
        "employeeId fullName email designation role"
    );
};

// ====================================
// Punch Out
// ====================================

export const punchOut = async (
    employeeId
) => {
    const attendance =
        await getTodayAttendance(
            employeeId
        );

    // ====================================
    // No attendance record
    // ====================================

    if (!attendance) {

        throw new Error(
            "You have not punched in today."
        );
    }

    const sessions =
        attendance.sessions || [];

    // ====================================
    // Find active session
    // ====================================

    const activeSession =
        sessions.find(
            (session) =>
                session.punchIn &&
                !session.punchOut
        );

    // ====================================
    // No active session
    // ====================================

    if (!activeSession) {

        throw new Error(
            "You are not currently punched in."
        );
    }

    // ====================================
    // Punch Out
    // ====================================

    const now = new Date();

    activeSession.punchOut =
        now;

    // ====================================
    // Recalculate total working time
    // ====================================

    attendance.workingMinutes =
        calculateWorkingMinutes(
            attendance.sessions
        );

    await attendance.save();

    return await Attendance.findById(
        attendance._id
    ).populate(
        "employee",
        "employeeId fullName email designation role"
    );
};

// ====================================
// Get My Attendance History
// ====================================

export const getMyAttendance = async (
    employeeId
) => {
    return await Attendance.find({
        employee: employeeId,
    })
        .sort({
            date: -1,
        })
        .populate(
            "employee",
            "employeeId fullName email designation role"
        );
};

// ====================================
// Get All Employee Attendance
// ====================================

export const getAllAttendance = async () => {
    return await Attendance.find()
        .sort({
            date: -1,
        })
        .populate(
            "employee",
            "employeeId fullName email designation role"
        );
};