import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
// // Route imports
import adminRouter from "./src/routes/admin.routes.js";
import employeeRouter from "./src/routes/employee.routes.js";
// Initialize environment variables
dotenv.config();
connectDB();


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());



// // API Routes
app.use("/api/admin",adminRouter);
app.use("/api/employee",employeeRouter);

// Root route
app.get("/", (req, res) => {
  res.send("CRM Backend Server Running ");
});

// Error handling middleware (for unhandled routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
