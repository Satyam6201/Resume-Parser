const express = require("express");
const cors = require("cors");
const path = require("path");
const resumeRoutes = require("./routes/resumeRoutes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));
// Serve output JSON statically for easy access if needed
app.use("/output", express.static(path.join(__dirname, "output")));

// API Routes
app.use("/api", resumeRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});