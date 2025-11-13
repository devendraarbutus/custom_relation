import express from "express";
import { adminVerification,adminauthenticateJWT } from "../middlewares/adminauth.middleware.js";
import employeeController from "../modules/employee/employee.controller.js";

const employeeRouter = express.Router();

employeeRouter.post('/login', employeeController.employeeLogin);
employeeRouter.post('/create',adminauthenticateJWT,adminVerification, employeeController.createEmployee);
employeeRouter.patch('/update/:id',adminauthenticateJWT,adminVerification, employeeController.updateEmployee);
employeeRouter.delete('/delete/:id',adminauthenticateJWT,adminVerification, employeeController.deleteEmployee);
employeeRouter.get('/getall',adminauthenticateJWT,adminVerification, employeeController.getAllEmployees);
employeeRouter.get('/getbyid/:id',adminauthenticateJWT,adminVerification, employeeController.getEmployeeById);
export default employeeRouter;