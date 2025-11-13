import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    adminName:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['superadmin','admin','subadmin'],
        default:'subadmin'
    },
        otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    },
},{timestamps:true});

const Admin = mongoose.model('admin', adminSchema);
export default Admin;