const jwt = require('jsonwebtoken')
const Teacher = require('../models/Teacher')
const Student = require('../models/Students')

const verifyJWT = async (req, res, next) => {

    const token = req.headers["x-access-token"]?.split(' ')[1];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {

            if (err) {
                return res.status(401).json({
                    isLoggedIn: false,
                    message: "Failed to Authenticate"
                })
            }
            req.isLoggedIn = true;

            if (req.headers["role"] == "Teacher") {
                req.user = await Teacher.findById(decoded.id);
            }
            else if (req.headers["role"] == "Student") {
                req.user = await Student.findById(decoded.id)
            }
            next()

        })
    }
    else {
        res.status(401).json({ message: "Please Login First", isLoggedIn: false })
    }
}

module.exports = verifyJWT;
