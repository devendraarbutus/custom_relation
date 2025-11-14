import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./src/config/db.js";
import adminRouter from "./src/routes/admin.routes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import employeeRouter from "./src/routes/employee.routes.js";
const app = express();
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// API ROUTES
app.use("/api/admin", adminRouter);
app.use("/api/employee", employeeRouter);

// Root Route
app.get("/", (req, res) => {
  res.send("CRM Backend Server is Running!");
});

// Error Handler (must be after routes)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
