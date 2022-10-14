const mongoose=require("mongoose");
const bcrypt = require ("bcrypt");
const jwt= require("jsonwebtoken");
const employeeSchema= new mongoose.Schema({
      l:{
        type:Number,
       },
        
     r:{
        type:Number,
        
     }  , 
     place:{
      type:String,
      require:true
     },
     location :{
     type: {type:String,required:true},
      coordinates:[]
     }
});




//we need to create our collection by our shcmea
employeeSchema.index({location:"2dsphere"})
const register=new mongoose.model("Map",employeeSchema);
module.exports=register;