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
       
       default:1
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
    marks:[{
        math:{
            type:Number,
            default:1

        },
        sceince:{
            type:Number,
            default:1
        }}
    ],
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

});
employeeSchema.methods.generateAuthToken=async function(){
    //into hash
    try {
        const token =jwt.sign({_id: this._id},"mynameisourabhiamcromnarsighgarhmadhyapreadesh")
        console.log(token);
        this.tokens=this.tokens.concat({token})
        await this.save();
        return token;
    } catch (error) {
        res.send("the error part"+error);
        console.log(error);
    }
}



//we need to create our collection by our shcmea

const student=new mongoose.model("student",employeeSchema);
module.exports=student;