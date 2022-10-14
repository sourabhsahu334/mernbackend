const Exceljs= require('exceljs');
const moment= require('moment');
const cookie= require("cookie");
const express = require("express");
const app= express();
const path= require("path");
const port= process.env.PORT || 3000;
const hbs= require("hbs");
require("./db/conn");
const Register1=require("./models/registers");
const teacher = require( "./models/teachers");
const map = require("./models/map");
//i am sourabh sahu full stack developer
const bcrypt=require("bcrypt");
const jwt= require("jsonwebtoken");
const route= require('./routes/routes');
const { json } = require('stream/consumers');
const auth = require( "./midelware/auth");

const cookieParser = require("cookie-parser");
const student = require('./models/teachers');
const static_path=path.join(__dirname,"../public" );
const template_path=path.join(__dirname,"../templates/views" );
const partial_path= path.join(__dirname,"../templates/partials");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use (express.static(static_path));
app.set("view engine", "hbs");
app.set("views",template_path);
hbs.registerPartials(partial_path);
app.use("/",route);
app.get("/",(req,res)=>{
    res.render("index1")
});
app.get("/login",(req,res)=>{
    res.render("login")
});
app.get("/register",auth,(req,res)=>{
    res.render("register")
});
app.post("/register",auth, async(req,res)=>{
    try{

         const password = req.body.password;
        const cpassword= req.body.confirmpassword;

        if(password=== cpassword){
            const registerEmployee= new Register1({

        
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            gender:req.body.gender,
            phone: req.body.phone,
            address:req.body.address,
            password:req.body.password,
            confirmpassword:req.body.confirmpassword,

            })

           //  const token = await registerEmployee.generateAuthToken();
             
             const registerd= await registerEmployee.save();
           
             
         
            console.log(registerd);
            res.status(201).render("main");


        }
        else{
            res.send("password is not match")
        }

    }catch (error){
        res.status(400).send(error);
        console.log("error ="+error )

    }
});
app.post("/login",async(req,res) =>{
    try {
        const name= req.body.username;
        const email= req.body.email;
        const password= req.body.password;

       const useremail = await teacher.findOne({email:email});

       
      // const ismatch= await bcrypt.compare(password,useremail.password);
       const token = await useremail.generateAuthToken();
       console.log(token);
       res.cookie ("jwt", token , {
        expires:new Date(Date.now() + 6000000 ) ,
       httpOnly:true
     });
       

        if(useremail.password===password){
            res.status(201).render("main");
        }
        else{
            res.send("invalid login details");
        }
     } catch (error) {
        console.log("invalid details"+error);
    }
});
app.get('/sheet',async(req,res,next)=>{
    const startdate= moment(new Date()).startOf('month').toDate();
    const enddate= moment(new Date()).endOf('month').toDate();
    try {
        console.log("s1");
        const  users = await Register1.find({created_At:{$gte: startdate, $lte:enddate}});
        const workbook= new Exceljs.Workbook();
        const worksheet = workbook.addWorksheet ('users');
        worksheet.columns=[{
            header:'s_no',key:'s_no',width:10},
       { header:'Email',key:'email',width:35},
       {header:'Name',key:'firstname',width:30},
      { header:'attendence',key:'attendence',width:10},
       {header:'mathmark',key:'math',width:10},
       {header:'sciencemarks',key:'sceince',width:10},
       ];
    console.log("s2");
    let count =1 ;
    users.forEach(user => {
        user.s_no = count;
        worksheet.addRow(user) ;
        count+=1;
    }); 
    console.log("s3");
    worksheet.getRow(1).eachCell((cell)=>{
        cell.font={bold:true};
    });
    console.log("s4");
    const data = await workbook.xlsx.writeFile('users.xlsx');
    console.log("s5");
    res.download('users.xlsx');
    } catch (error) {
        
    }
});


app.get('/login/marks',auth,(req,res)=>
{
    res.render('marks');
});
app.post('/login/marks',async(req,res)=>{
    const email= req.body.email;
    const mathmakrs= req.body.mathmarks;
    const sciencemarks = req.body.sciencemarks;
    try {
      const result = await Register1.updateOne({email:email},{
          $set:{
               "math":mathmakrs,
               "sceince":sciencemarks
           }
        });
      console.log( "hi this is succesfull ");
      res.render('main')
   
    } catch (error) {
      console.log(error);
    }
  
    

})
app.get('/login/marksheet',auth,(req,res)=>
{
    res.send('thier is no imformation such feed by you ');
});
app.get('/get-attendence',auth,(req,res)=>{
    res.render('stat');
})
  // student attendence
app.post('/get-attendence',auth,async(req,res)=>{
    try {
        let email = req.body.email;
        const register = await Register1.findOne({email:email});
       const attendence= register.attendence;
       const name= register.firstname;
       const mathmarks= register.marks.math;
       const sciencemarks = register.marks.sceince;
       const address = register.address;
       const fathername= register.fathername;
        var  array={name,email,address,mathmarks,sciencemarks,attendence};
        console.log(array);
        let jsonContent = JSON.stringify(array);
        let data = `<h2> Name : ${array.name} <h2> <h2> email : ${array.email} <h2>
        <h2> Address : ${array.address} <h2>
        <h2> Fathername : ${array.fathername} <h2>
        <h2> attendence : ${array.attendence} <h2>
        <h2> Mathematic Marks: ${array.mathmarks} <h2>
        <h2> Sceince Marks: ${array.sciencemarks} <h2>
        <h2> Ramarks about : ${array.name} is good <h2>`
        return res.send(`<h1 > ${data}</h1>`);
       } catch (error) {
        console.log( error);
       }
  // return res.send(jsonContent);
});
app.get('/updateattendence', auth ,(req,res)=>{
    try {
        res.render('updateattendence');
    } catch (error) {
        console.log(error);
    }
});
app.post('/updateattendence' ,async(req,res)=>{
      const email= req.body.email;
      const att= req.body. attendence;
      try {
        const result = await Register1.updateOne({email:email},{
            $set :{ "attendence":att}});
        
      } catch (error) {
        console.log(error);
      }
});

app.get('/deletestudent' , auth,(req,res)=>{
    res.render ('delete');
});
app.post('/deletestudent',async(req,res)=>{
    const name= req.body.username;
    const attendence= req.body. attendence;
    try {
      const result = await Register1.deleteOne({firstname:name})
      console.log(result);
      res.send('done');

    } catch (error) {
      console.log(error);
    }
});
app.get('/logout', (req,res)=>{
 res.clearCookie('jwt');
 res.render('index');

});
app.get('/studentlogin',(req,res)=>{
    res.render('studentlogin')
});
app.post('/studentlogin',async(req,res)=>{
    try {
     let email = req.body.email;
     let password= req.body.password;
     const register = await Register1.findOne({email:email});
    if(password==register.password){
    const attendence= register.attendence;
    const image= register.avatar;
    const name= register.firstname;
    const mathmarks= register.math;
    const sciencemarks = register.sceince;
    const address = register.address;
    const fathername= register.fathername;
     var  array={name,email,address,mathmarks,sciencemarks,attendence,image};
     console.log(array);
     let jsonContent = JSON.stringify(array);
     let data = `<h2> Name : ${array.name} <h2> <h2> email : ${array.email} <h2>
     
 
     <h2> Address : ${array.address} <h2>
     <h2> Fathername : ${array.fathername} <h2>
     <h2> attendence : ${array.attendence} <h2>
     <h2> Mathematic Marks: ${array.mathmarks} <h2>
     <h2> Sceince Marks: ${array.sciencemarks} <h2>
     <h2> Ramarks about : ${array.name} is good <h2>
     `
     
     console.log(data);
     return res.send(`<h1 > ${data}</h1> 
     <img src=${image}  style="width:128px;height:128px;">`);
    }
    else{
        res.send("invalid details")
        }
    }
     
     catch (error) {
     console.log( error);
    }
 });
app.get('/map',(req,res)=>{
    res.render('map');
})
app.post( '/map', async(req,res)=>{
    

    const placeof = req.body.place;
    try {
        const map1 = new  map({
            place :req.body.place,
            location:{
             type:"Point",
                coordinates:[parseFloat(req.body.l),parseFloat(req.body.r)]
            }
     })
        const map2= await map1.save();
        
    
        console.log( map2);
     
       
        
        res.render('main')

    }catch (error) {
        console.log(error);
    }
});
app.get('/map2',(req,res)=>{
    res.render('map2')
})
app.post('/nearlocation',async(req,res)=>{
     try {
        const  l= req.body.l;
        const  r = req.body.r;
        const data = await map.aggregate([
            {
          $geoNear:{
              near :{ type:"Point",coordinates:[parseFloat(l),parseFloat(r)]},
              key:"location",
              maxDistance:parseFloat(1000)*1609,
              distanceField:"dist.calculated"
              ,spherical:true

  
          }}
        ])
        console.log(data);
        res.send(data);
     } catch (error) {
        console.log(error)
     }
})

app.listen(port,()=>{
    console.log(`server is running at port ${port}`);
})