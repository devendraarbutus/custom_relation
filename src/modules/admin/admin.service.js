import Admin from "../../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import Employee from "../../models/employee.model.js";
import { sendEmailWithAttachment } from "../../utils/sendemail.js";
import ExcelJS from "exceljs";
import { Parser as Json2csvParser } from "json2csv";
import PDFDocument from "pdfkit";
const JWT_SECRET = process.env.JWT_SECRET;

const generateXLS = async (employees) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Employees");
  sheet.columns = [
    { header: "Name", key: "employeeName", width: 30 },
    { header: "Email", key: "email", width: 30 },
    { header: "Mobile", key: "mobile", width: 15 },
    { header: "Role", key: "role", width: 15 },
    { header: "Status", key: "status", width: 15 },
    { header: "Created By", key: "createdBy", width: 30 },
  ];

  sheet.addRows(
    employees.map((emp) => ({
      employeeName: emp.employeeName,
      email: emp.email,
      mobile: emp.mobile,
      role: emp.role,
      status: emp.status,
      createdBy: emp.createdBy ?emp.createdBy.adminName  : 'N/A',
    }))
  );

  const buffer = await workbook.xlsx.writeBuffer();
  return { buffer, filename: "employee_report.xlsx", contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
};

const generateCSV = (employees) => {
  const mappedEmployees = employees.map(emp => ({
    employeeName: emp.employeeName,
    email: emp.email,
    mobile: emp.mobile,
    role: emp.role,
    status: emp.status,
    createdBy: emp.createdBy ? emp.createdBy.adminName : "N/A", // use adminName
  }));
  const fields = ["employeeName", "email", "mobile", "role", "status", "createdBy"];
  const parser = new Json2csvParser({ fields });
  const csv = parser.parse(mappedEmployees);
  return { buffer: csv, filename: "employee_report.csv", contentType: "text/csv" };
};

const generatePDF = (employees) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      resolve({ buffer: pdfBuffer, filename: "employee_report.pdf", contentType: "application/pdf" });
    });

    doc.fontSize(18).text("Employee Report", { align: "center" });
    doc.moveDown();

    employees.forEach((emp) => {
      doc.fontSize(12).text(
        `Name: ${emp.employeeName} | Email: ${emp.email} | Mobile: ${emp.mobile} | Role: ${emp.role} | Status: ${emp.status}`
      );
      doc.moveDown(0.5);
    });

    doc.end();
  });
};

export default {
  adminSignupService: async (data) => {
    const { adminName, email, password, role } = data;

    // Duplicate check
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      const error = new Error("Admin  email already exists");
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const admin = await Admin.create({
      adminName,
      email,
      password: hashedPassword,
      role
    });

    return {
      id: admin._id,
      adminName: admin.adminName,
      email: admin.email,
      role: admin.role
    };
  },


  adminLoginService: async (email, password) => {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      const error = new Error("Invalid email or password");
      error.statusCode = 400;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.statusCode = 400;
      throw error;
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role
      },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    return { token };
  },


  getAdminsService: async ({ roleFilter, page, limit, search }) => {
    const query = {
      role: { $in: roleFilter },
      $or: [
        { adminName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    };

    const skip = (page - 1) * limit;

    const admins = await Admin.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Admin.countDocuments(query);

    return {
      total,
      page,
      limit,
      admins,
      totalPages: Math.ceil(total / limit)
    };
  },
  sendEmployeeReportService: async (adminEmail, format) => {

    const employees = await Employee.find().populate({ path: "createdBy", select: "adminName" });
    if (!employees.length) throw new Error("No employees found");

    let file;
    if (format === "xls") {
      file = await generateXLS(employees);
    } else if (format === "csv") {
      file = generateCSV(employees);
    } else if (format === "pdf") {
      file = await generatePDF(employees);
    } else {
      throw new Error("Invalid format. Use pdf, csv, or xls");
    }

    await sendEmailWithAttachment({
      to: adminEmail,
      subject: "Employee Report",
      text: "Please find attached the employee report.",
      filename: file.filename,
      content: file.buffer,
      contentType: file.contentType,
    });

    return { message: `Employee report sent to ${adminEmail} as ${format}` };
  },
};
