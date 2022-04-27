var express = require("express");
var router = express.Router();

const Teacher = require("../../models/Teacher");

router.post("/updateProfile", (req, res) => {

    Teacher.updateOne({ email : req.body.email}, {
        $set: {
            name : req.body.name,
            contact: req.body.contact,
            address: req.body.address
        }
    }).then(teacher => {
        res.status(200).json(teacher);
    })
    .catch(err => {
        res.status(400).json({
            message: "Cannot Update Profile. Please Contact Support",
            error : err
        })
    })
})

module.exports = router;