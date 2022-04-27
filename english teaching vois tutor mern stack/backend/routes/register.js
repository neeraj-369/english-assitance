var express = require("express");
var router = express.Router();
const bcrypt = require('bcryptjs');

const Admin = require("../models/Admin");
const Student = require("../models/Students");
const Teacher = require("../models/Teacher");

/*router.post("/", (req, res) => {
    const role = req.body.role;
    if(role == "student" || role == "teacher"){
        console.log("Teachers and Students can only be registered by Admin!!\nPlease contact Admin for further details");
        res.json({success: false, msg: "Teachers and Students can only be registered by Admin!!\nPlease contact Admin for further details"});
    }else{
        const newAdmin = new Admin({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        Admin.save(newAdmin,(err,result) => {
            if(err){
                console.log(err);
                res.json({success: false, msg: "Error: " + err});
            }
            else if(!result){
                res.json({success: false, msg: "This operation is not allowed"});
            }
            else if(result){
                res.json({success: true, msg: "Admin registered"});
            }
        })
    }
})
*/

router.post("/registerTeacher", async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    const teacher = new Teacher({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        dob: req.body.dob,
        classes : req.body.classes,
        qualification : req.body.qualification,
        experience : req.body.experience,
        contact : req.body.contact,
        address : req.body.address,
        image : req.body.image,
    })

    Teacher.create(teacher).then((teacher) => {
            res.status(200).send(teacher);
    })
    .catch(err => {
        console.log(err)
        res.status(400).json({message: "Could not add Teacher. Please contact Support"});
    })
})

router.post("/registerStudent", async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const student = new Student({
        name: req.body.name,
        rollno : req.body.rollno,
        email: req.body.email,
        password: hashedPassword,
        cls : req.body.cls,
        contact : req.body.contact,
        address : req.body.address,
    })

    Student.create(student)
    .then(stu => {
        res.status(200).send(stu);
    })
    .catch(err => {
        res.status(400).send("ERR")
    })
})

router.post("/registerAdmin", async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const admin = new Admin({
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword,
    })

    Admin.create(admin)
    .then(adm => {
        res.status(200).send(adm)
    })
    .catch(err => {
        res.status(400).send("ERR")
    })

})

router.post("/:id", (req, res) => {
    const id = req.params.id
    if(!req.session.user){
        res.redirect("/login");
    }
    Admin.findbyId(id, (err, admin) =>{
        if(err){
            console.log(err);
            res.json({success: false, msg: "Error: " + err});
        }
        else{
            if(!admin){
                res.json({success: false, msg: "Admin not found"});
            }
            else{
                const role = req.body.role;
                if(role === "student"){
                    const student = new Student({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        class: req.body.class,
                        
                    });
                    Student.save((err, student) =>{
                        if(err){
                            console.log(err);
                            res.json({success: false, msg: "Error: " + err});
                        }
                        else{
                            res.json({success: true, msg: "Student registered"});
                        }
                    });
                }if(role == "teacher"){
                    const teacher = new Teacher({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        class: req.body.class,
                        
                    });
                    Teacher.save((err, teacher) =>{
                        if(err){
                            console.log(err);
                            res.json({success: false, msg: "Error: " + err});
                        }else if(!teacher){
                            res.json({success: false, msg: "Teacher not found"});
                        }
                        else if(teacher){
                            res.json({success: true, msg: "Teacher registered"});
                        }
                    });
                }

            }
        }
    })
});

module.exports = router;