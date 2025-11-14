import express from "express";
import { adminController } from "../modules/admin/admin.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin signup
router.post("/signup", adminController.adminSignup);

// Admin login
router.post("/login", adminController.adminLogin);

// Example protected route
// router.get("/profile", verifyAdmin, adminController.getProfile);

export default router;
