const express = require("express");
const router = express.Router();
const pool = require("../db"); // Ensure you have a PostgreSQL connection pool set up

// GET /dashboard/stats
router.get("/stats", async (req, res) => {
    try {
        const { month, year } = req.query; // Expecting month and year as query params
        
        if (!month || !year) {
            return res.status(400).json({ error: "Month and year are required" });
        }
        
        // Fetch total number of students
        const totalStudentsQuery = "SELECT COUNT(*) FROM Students";
        const totalStudentsResult = await pool.query(totalStudentsQuery);
        const totalStudents = totalStudentsResult.rows[0].count;

        // Fetch average marks by subject for the given month
        const avgMarksQuery = `
            SELECT s.sub_name, AVG(m.score) as average_marks 
            FROM Marks m
            JOIN Subjects s ON m.sub_id = s.sub_id
            WHERE m.month = $1 AND m.year = $2
            GROUP BY s.sub_name
        `;
        const avgMarksResult = await pool.query(avgMarksQuery, [month, year]);
        const avgMarks = avgMarksResult.rows;

        // Fetch top students by subject for the given month
        const topStudentsQuery = `
            SELECT s.sub_name, st.name AS student_name, m.score
            FROM Marks m
            JOIN Subjects s ON m.sub_id = s.sub_id
            JOIN Students st ON m.student_id = st.student_id
            WHERE m.month = $1 AND m.year = $2
            AND m.score = (SELECT MAX(score) FROM Marks WHERE month = $1 AND year = $2 AND sub_id = m.sub_id)
        `;
        const topStudentsResult = await pool.query(topStudentsQuery, [month, year]);
        const topStudents = topStudentsResult.rows;

        res.json({
            totalStudents,
            avgMarks,
            topStudents,
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
