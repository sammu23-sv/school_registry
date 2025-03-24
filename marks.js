const express = require("express");
const { Pool } = require("pg");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 🔹 STUDENT: View only their own marks
router.get("/student/:student_id", authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.id != req.params.student_id) {
            return res.status(403).json({ message: "Access Denied" });
        }

        const marks = await pool.query("SELECT * FROM Marks WHERE student_id = $1", [req.params.student_id]);
        res.json(marks.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔹 TEACHER & ADMIN: View marks of any student
router.get("/teacher/:student_id", authenticateToken, authorizeRoles("admin", "teacher"), async (req, res) => {
    try {
        const query = `
            SELECT s.sub_name AS subject, m.score , m.month,m.year,s.sub_id
            FROM Marks m
            JOIN Subjects s ON m.sub_id = s.sub_id
            WHERE m.student_id = $1
            ORDER BY s.sub_id;
        `;

        const marks = await pool.query(query, [req.params.student_id]);

        res.json(marks.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🔹 TEACHER & ADMIN: Update student marks
router.put("/:student_id/:sub_id", authenticateToken, authorizeRoles("admin", "teacher"), async (req, res) => {
    try {
        const { score } = req.body;

        if (score < 0 || score > 100) {
            return res.status(400).json({ message: "Score must be between 0 and 100" });
        }

        const result = await pool.query(
            "UPDATE Marks SET score = $1 WHERE student_id = $2 AND sub_id = $3 RETURNING *",
            [score, req.params.student_id, req.params.sub_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Mark not found" });
        }

        res.json({ message: "Mark updated successfully", mark: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔹 TEACHER & ADMIN: Add new marks for students
router.post("/", authenticateToken, authorizeRoles("admin", "teacher"), async (req, res) => {
    try {
        const { student_id, sub_id, month, year, score } = req.body;

        // Validate required fields
        if (!student_id || !sub_id || !month || !year || !score) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Check if student exists
        const studentExists = await pool.query("SELECT * FROM students WHERE student_id = $1", [student_id]);
        if (studentExists.rows.length === 0) {
            return res.status(400).json({ message: `Student ID ${student_id} does not exist.` });
        }

        // Check if subject exists
        const subjectExists = await pool.query("SELECT * FROM subjects WHERE sub_id = $1", [sub_id]);
        if (subjectExists.rows.length === 0) {
            return res.status(400).json({ message: `Subject ID ${sub_id} does not exist.` });
        }

        // Insert mark
        const result = await pool.query(
            "INSERT INTO Marks (student_id, sub_id, month, year, score) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [student_id, sub_id, month, year, score]
        );

        res.status(201).json({ message: "Mark added successfully", mark: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔹 TEACHER & ADMIN: Delete student marks
router.delete("/:student_id/:sub_id", authenticateToken, authorizeRoles("admin", "teacher"), async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM Marks WHERE student_id = $1 AND sub_id = $2 RETURNING *",
            [req.params.student_id, req.params.sub_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Mark not found" });
        }

        res.json({ message: "Mark deleted successfully", mark: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/top-students',authenticateToken, authorizeRoles("teacher"), async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT ON (s.sub_id) 
                s.sub_name, 
                st.name AS student_name, 
                m.score
            FROM Marks m
            JOIN Subjects s ON m.sub_id = s.sub_id
            JOIN Students st ON m.student_id = st.student_id
            ORDER BY s.sub_id, m.score DESC;
        `;

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching top students:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; // ✅ Export the router correctly
