const express = require("express");
const cors = require("cors");
const pool = require("./db");  // Importing the new db.js file

const authRoutes = require("./routes/auth");
const studentsRoutes = require("./routes/students");
const subjectsRoutes = require("./routes/subjects");
const dashboardRoutes = require("./routes/dashboard");
const usersRoutes = require("./routes/users");
const marksRoutes = require("./routes/marks");


const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/students", studentsRoutes);
app.use("/subjects", subjectsRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/users", usersRoutes);
app.use("/marks",marksRoutes);


app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});
