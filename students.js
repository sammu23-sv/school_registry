const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 🔹 Admin & Teacher can view all students
router.get("/", authenticateToken, authorizeRoles("admin", "teacher"), async (req, res) => {
    try {
        const result = await pool.query("SELECT student_id, name FROM Students");

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No students found" });
        }

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🔹 Student can view their own marks
router.get("/marks", authenticateToken, async (req, res) => {
    try {
        const studentId = req.user.id; // Get student ID from authenticated user

        const result = await pool.query(`
            SELECT Marks.month, Marks.year, Marks.score, Subjects.sub_name 
            FROM Marks 
            JOIN Subjects ON Marks.sub_id = Subjects.sub_id
            WHERE Marks.student_id = $1
        `, [studentId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No marks found for this student" });
        }

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🔹 2️⃣ Admin can ADD a new student
router.post("/", authenticateToken, authorizeRoles("admin","teacher"), async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({ message: "Student name is required" });
        }

        const result = await pool.query("INSERT INTO Students (name) VALUES ($1) RETURNING *", [name]);
        res.status(201).json({ message: "Student added successfully", student: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔹 3️⃣ Admin can MODIFY student details
router.put("/:student_id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Student name is required" });
        }

        const result = await pool.query("UPDATE Students SET name = $1 WHERE student_id = $2 RETURNING *", [name, req.params.student_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student updated successfully", student: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔹 4️⃣ Admin can DELETE a student
router.delete("/:student_id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
    try {
        const result = await pool.query("DELETE FROM Students WHERE student_id = $1 RETURNING *", [req.params.student_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student deleted successfully", student: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
