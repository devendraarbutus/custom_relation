import express from "express";
import adminController from "../modules/admin/admin.controller.js";
import { adminauthenticateJWT, adminVerification } from "../middlewares/adminauth.middleware.js";
const adminRouter = express.Router();

adminRouter.post("/signup", adminController.adminSignup);
adminRouter.post("/login", adminController.adminLogin);
adminRouter.get("/list", adminauthenticateJWT, adminVerification, adminController.getAdmins);


export default adminRouter;

