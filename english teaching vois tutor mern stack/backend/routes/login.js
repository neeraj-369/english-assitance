var express = require("express");
var router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require("../models/Admin");
const Student = require("../models/Students");
const Teacher = require("../models/Teacher");
const verifyJWT = require("../middleware/verifyJWT");

function getidByEmail(email) {
    return new Promise((resolve, reject) => {
        Admin.findOne({ email: email }, (err, admin) => {
            if (err) {
                return
            } else {
                resolve(admin._id);
            }
        });
    });
}

router.post("/getToken", (req, res) => {
    res.send({
        token: 'test123'
    });
})

router.post("/", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    if (email && password) {
        if (role == "Student") {
            const student = await Student.findOne({ email: email })
            if (!student) {
                return res.status(401).json({
                    message: "No Account exists with the given credentials"
                })
            }

            const isMatch = await bcrypt.compare(req.body.password, student.password)
            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid Credentials"
                })
            }

            const payload = {
                id: student._id,
                email: student.email
            }
            const token = jwt.sign(payload,
                process.env.JWT_SECRET,
                { expiresIn: 86400 },
                (err, token) => {
                    if (err) {
                        return res.json({
                            message: err
                        })
                    }
                    return res.status(200).json({
                        message: "Success",
                        token: "Student " + token
                    })
                }
            )

        } else if (role == "Admin") {
            const admin = await Admin.findOne({ email: email })
            if (!admin) {
                return res.status(401).json({
                    message: "No Account exists with the given credentials"
                })
            }

            const isMatch = await bcrypt.compare(req.body.password, admin.password)
            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid Credentials"
                })
            }

            const payload = {
                id: admin._id,
                email: admin.email
            }
            const token = jwt.sign(payload,
                process.env.JWT_SECRET,
                { expiresIn: 86400 },
                (err, token) => {
                    if (err) {
                        return res.json({
                            message: err
                        })
                    }
                    return res.status(200).json({
                        message: "Success",
                        token: "Admin " + token
                    })
                }
            )
        } else if (role == "Teacher") {
            const teacher = await Teacher.findOne({ email: email });
            if (!teacher) {
                return res.status(401).json({
                    message: "No Account exists with the given credentials"
                })
            }

            const isMatch = await bcrypt.compare(req.body.password, teacher.password)
            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid Credentials"
                })
            }

            const payload = {
                id: teacher._id,
                email: teacher.email
            }
            const token = jwt.sign(payload,
                process.env.JWT_SECRET,
                { expiresIn: 86400 },
                (err, token) => {
                    if (err) {
                        return res.json({
                            message: err
                        })
                    }
                    return res.status(200).json({
                        message: "Success",
                        token: "Bearer " + token
                    })
                }
            )
        }
    } else {
        res.json({
            success: false,
            msg: "Error: Email or password cannot be blank"
        });
    }
});

router.get("/isUserAuth", verifyJWT, (req, res) => {
    return res.json(
        {
            isLoggedIn: true,
            user: req.user
        });
})

module.exports = router;