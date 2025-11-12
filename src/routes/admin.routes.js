import express from 'express';
import adminController from '../modules/admin/admin.controller.js';
const adminRouter = express.Router();


adminRouter.post('/signup', adminController.adminSignup);
adminRouter.post('/login', adminController.adminLogin);

export default adminRouter;