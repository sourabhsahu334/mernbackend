const mongoose=require("mongoose");
const bcrypt = require ("bcrypt");
const jwt= require("jsonwebtoken");
const employeeSchema= new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
  
    email:{
        type:String,
        required:true,
        unique:true,
    },
    gender:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    address:{
        type:String
        
    },
    attendence:{
       type:String,
        default:"1"
    },
    rollnumber:{
        type:String,
        
    },
   
    password:{
        type:String,
        required:true,

    },
    confirmpassword:{
        type:String,
        required:true,
    },
    
        math:{
            type:String,
            default:"1"

        },
        sceince:{
            type:String,
            default:"1"
        },
   
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

});




//we need to create our collection by our shcmea

const register=new mongoose.model("Register",employeeSchema);
module.exports=register;