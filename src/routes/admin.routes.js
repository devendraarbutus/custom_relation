import express from "express";
import adminController from "../modules/admin/admin.controller.js";

const router = express.Router();

/**
 * 🧩 ADMIN ROUTES
 * Base path: /api/admin
 *
 * Public Routes:
 *  - POST /signup → Create new admin
 *  - POST /login  → Admin login
 */

// Admin Authentication Routes
router.post("/signup", (req, res, next) => adminController.adminSignup(req, res, next));
router.post("/login", (req, res, next) => adminController.adminLogin(req, res, next));

export default router;
