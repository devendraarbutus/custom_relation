import Employee from "../../models/employee.model.js";
import bcrypt from "bcrypt";
import sendEmail from "../../utils/sendemail.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
const JWT_SECRET = process.env.JWT_SECRET;
export default {
    
    // CREATE EMPLOYEE
    createEmployeeService: async (data,adminRole) => {
        const { employeeName, email, mobile, password, createdBy } = data;

        if (!["superadmin", "admin", "subadmin"].includes(adminRole)) {
      const err = new Error("You are not authorized to create employees");
      err.statusCode = 403;
      throw err;
    }

        const existing = await Employee.findOne({ email });
        if (existing) {
            const error = new Error("Email already exists");
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password.trim(), 10);

        const employee = new Employee({
            employeeName,
            email,
            mobile,
            password: hashedPassword,
            createdBy
        });

        await employee.save();

        // SEND EMAIL WITH PLAIN PASSWORD
        await sendEmail({
            to: email,
            subject: "Your Employee Account Credentials",
            html: `
                <h2>Welcome ${employeeName}!</h2>
                <p>Your employee account has been created in Arbutus Infotech Pvt lmt, Palasia , Indore .</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${password}</p>
                <br/>
                <p>Use these credentials to login.</p><br/>
                <p>Thank you!</p>
            `
        });

        return employee;
    },

    // GET ALL EMPLOYEES
    getEmployeesService: async ({ page, limit, search }) => {
        const query = {
            $or: [
                { employeeName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ]
        };

        const skip = (page - 1) * limit;

        const employees = await Employee.find(query)
            .select("-password")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Employee.countDocuments(query);

        return {
            total,
            page,
            limit,
            employees,
            totalPages: Math.ceil(total / limit)
        };
    },

    // GET EMPLOYEE BY ID
    getEmployeeByIdService: async (id) => {
        const emp = await Employee.findById(id).select("-password");
        if (!emp) {
            const err = new Error("Employee not found");
            err.statusCode = 404;
            throw err;
        }
        return emp;
    },

    // UPDATE EMPLOYEE
    updateEmployeeService: async (id, data, adminRole) => {

        if (!["superadmin", "admin"].includes(adminRole)) {
      const err = new Error("Only Superadmin or Admin can update employees");
      err.statusCode = 403;
      throw err;
    }


        const updated = await Employee.findByIdAndUpdate(id, data, {
            new: true
        }).select("-password");

        if (!updated) {
            const err = new Error("Employee not found");
            err.statusCode = 404;
            throw err;
        }

        return updated;
    },

    // DELETE EMPLOYEE
    deleteEmployeeService: async (id, adminRole) => {

        if (adminRole !== "superadmin") {
            const err = new Error("Only Superadmin can delete employees");
            err.statusCode = 403;
            throw err;
        }

        const deleted = await Employee.findByIdAndDelete(id);
        if (!deleted) {
            const err = new Error("Employee not found");
            err.statusCode = 404;
            throw err;
        }
        return deleted;
    },
    employeeLoginService:async(email,password)=>{
      const employee = await Employee.findOne({ email });
  if (!employee) {
    const error = new Error("Invalid email or password");
    error.statusCode = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(password.trim(), employee.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 400;
    throw error;
  }

  // JWT Token
  const token = jwt.sign(
    { _id: employee._id, role: employee.role },
    JWT_SECRET,
    { expiresIn: "12h" }
  );

  return { token, employee: {
    id: employee._id,
    employeeName: employee.employeeName,
    email: employee.email,
    mobile: employee.mobile,
    role: employee.role
  }};
    }
};
