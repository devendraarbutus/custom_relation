import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./src/config/db.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import adminRouter from "./src/routes/admin.routes.js";
import employeeRoutes from "./src/routes/employee.routes.js";
import taskRoutes from "./src/routes/task.routes.js";
import workLogRoutes from "./src/routes/worklog.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected successfully");

    app.use("/api/admin", adminRouter);
    app.use("/api/employees", employeeRoutes);
    app.use("/api/tasks", taskRoutes);
    app.use("/api/worklogs", workLogRoutes);

    app.get("/", (req, res) =>
      res.status(200).json({ success: true, message: "CRM Backend Server Running" })
    );

    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
    });

    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err.message);
      server.close(() => process.exit(1));
    });

    process.on("SIGINT", () => {
      console.log("\nServer shutting down gracefully...");
      server.close(() => process.exit(0));
    });
  } catch (error) {
    console.error("Server initialization failed:", error.message);
    process.exit(1);
  }
};

startServer();
