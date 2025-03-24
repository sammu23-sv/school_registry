const express = require("express");
const { Pool } = require("pg");

const router = express.Router();

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// 1️⃣ GET all subjects
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT sub_id, sub_name FROM Subjects"); // ✅ Fetch subjects correctly
        res.json(result.rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
});


// 2️⃣ GET a single subject by ID
router.get("/:sub_id", async (req, res) => {
    const subjectId = req.params.sub_id;
    try {
        const result = await pool.query("SELECT * FROM Subjects WHERE sub_id = $1", [subjectId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Subject not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 3️⃣ POST (Add a new subject)
router.post("/", async (req, res) => {
    const { sub_name } = req.body;
    if (!sub_name) {
        return res.status(400).json({ message: "Subject name is required" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO Subjects(sub_name) VALUES ($1) RETURNING *",
            [sub_name]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 4️⃣ PUT (Update a subject)
router.put("/:sub_id", async (req, res) => {
    const { sub_name } = req.body;
    const sub_id = req.params.sub_id;

    try {
        const result = await pool.query(
            "UPDATE Subjects SET sub_name = $1 WHERE sub_id = $2 RETURNING *",
            [sub_name, sub_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Subject not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 5️⃣ DELETE (Remove a subject)
router.delete("/:sub_id", async (req, res) => {
    const sub_id = req.params.sub_id;

    try {
        const result = await pool.query("DELETE FROM Subjects WHERE sub_id = $1 RETURNING *", [sub_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Subject not found" });
        }

        res.json({ message: "Subject deleted", subject: result.rows[0] });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
});



// Export the router
module.exports = router;
