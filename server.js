import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import employeeRoutes from "./src/routes/employee.routes.js"; // default import works

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
connectDB();

// Routes (uncomment when ready)
// import userRoutes from "./src/routes/user.routes.js";
// import taskRoutes from "./src/routes/task.routes.js";
// import notificationRoutes from "./src/routes/notification.routes.js";
// app.use("/api/users", userRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/notifications", notificationRoutes);
   app.use("/api/employees", employeeRoutes);

// Root route
app.get("/", (req, res) => res.send("CRM Backend Server Running "));

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
