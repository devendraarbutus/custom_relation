import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import  adminRouter from "./src/routes/admin.routes.js";
dotenv.config();
connectDB();


const app = express();

app.use(cors());
app.use(express.json());



app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
  res.send("CRM Backend Server Running ");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
// this com