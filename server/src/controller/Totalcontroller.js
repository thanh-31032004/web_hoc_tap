import User from '../models/user.js';
import Course from '../models/course.js';
import Lesson from '../models/lesson.js';
import UserProgress from '../models/userprogress.js';
export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCourses = await Course.countDocuments();
        const totalLessons = await Lesson.countDocuments();

        const userStats = await User.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const courseStats = await Course.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const lessonStats = await Lesson.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const topUsers = await UserProgress.aggregate([
            { $unwind: "$lessonStatus" },
            { $match: { "lessonStatus.status": "hoàn thành" } },
            {
                $group: {
                    _id: "$user",
                    totalCompletedLessons: { $sum: 1 }
                }
            },
            { $sort: { totalCompletedLessons: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 0,
                    userId: "$user._id",
                    username: "$user.username",
                    totalCompletedLessons: 1
                }
            }
        ]);

        const topCourses = await UserProgress.aggregate([
            { $unwind: "$lessonStatus" },
            { $match: { "lessonStatus.status": "hoàn thành" } },
            {
                $group: {
                    _id: "$course",
                    totalCompletedLessons: { $sum: 1 }
                }
            },
            { $sort: { totalCompletedLessons: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "courses",
                    localField: "_id",
                    foreignField: "_id",
                    as: "course"
                }
            },
            { $unwind: "$course" },
            {
                $project: {
                    _id: 0,
                    courseId: "$course._id",
                    title: "$course.title",
                    totalCompletedLessons: 1
                }
            }
        ]);

        const peakMonthAgg = await UserProgress.aggregate([
            { $unwind: "$lessonStatus" },
            { $match: { "lessonStatus.status": "hoàn thành", "lessonStatus.completedAt": { $ne: null } } },
            {
                $group: {
                    _id: {
                        year: { $year: "$lessonStatus.completedAt" },
                        month: { $month: "$lessonStatus.completedAt" }
                    },
                    totalLessons: { $sum: 1 }
                }
            },
            { $sort: { totalLessons: -1 } },
            { $limit: 1 }
        ]);

        const peakMonth = peakMonthAgg[0]
            ? {
                year: peakMonthAgg[0]._id.year,
                month: peakMonthAgg[0]._id.month,
                totalLessons: peakMonthAgg[0].totalLessons
            }
            : null;

        return res.status(200).json({
            success: true,
            totalUsers,
            totalCourses,
            totalLessons,
            userStats,
            courseStats,
            lessonStats,
            topUsers,
            topCourses,
            peakMonth
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

