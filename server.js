import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";

// Route imports
import userRoutes from "./src/routes/user.routes.js";
import taskRoutes from "./src/routes/task.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";

// Initialize environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("CRM Backend Server Running ");
});

// Error handling middleware (for unhandled routes)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
// this com