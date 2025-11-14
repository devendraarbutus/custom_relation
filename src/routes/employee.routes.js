import express from "express";
import {adminauthenticateJWT, adminVerification} from "../middlewares/adminauth.middleware.js";
import employeeController from "../modules/employee/employee.controller.js";

const employeeRouter = express.Router();

employeeRouter.post(
    "/create",
    adminauthenticateJWT, adminVerification,
    employeeController.createEmployee
);

employeeRouter.post("/login",employeeController.employeeLogin);

employeeRouter.get(
    "/getall",
    adminauthenticateJWT, adminVerification,
    employeeController.getEmployees
);

employeeRouter.get(
    "/get/:id",
    adminauthenticateJWT, adminVerification,
    employeeController.getEmployeeById
);

employeeRouter.patch(
    "/update/:id",
    adminauthenticateJWT, adminVerification,
    employeeController.updateEmployee
);

employeeRouter.delete(
    "/delete/:id",
    adminauthenticateJWT, adminVerification,
    employeeController.deleteEmployee
);

export default employeeRouter;