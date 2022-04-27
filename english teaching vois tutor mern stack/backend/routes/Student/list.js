var express = require("express");
var router = express.Router();

const Student = require("../../models/Students");
const Sentence = require("../../models/Sentence");
const axios = require('axios');

router.post("/addStudent", (req, res) => {

    const newstu = new Student(req.body)
    newstu.save((err, stu) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error: " + err });
        }
        else {
            res.json({ success: true, msg: "Student added", result: stu });
        }
    })

})

// Get all students
router.post("/", (req, res) => {

    // Here cls is the class of the student along with section
    // i.e cls = "1A"
    const cls = req.body.cls;

    // Find all students of the class
    Student.find({ cls: cls }, { name: 1, cls: 1, classChapter: 1, rollno: 1, progress: 1 }, (err, students) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error: " + err });
        } else if (!students) {
            res.json({ success: false, msg: "No students found" });
        } else if (students) {
            res.json({ success: true, students: students });
        }
    }
    );
});

router.post("/getStudent", (req, res) => {
    const cls = req.body.cls;
    const rollno = req.body.rollno;
    // Find all students of the class
    Student.find({ cls: cls, rollno: rollno }, (err, students) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error: " + err });
        } else if (!students) {
            res.json({ success: false, msg: "No students found" });
        } else if (students) {
            res.json({ success: true, students: students });
        }
    })
})

router.post("/getTestSentences", async (req, res) => {
    console.log(req.body.cls);
    var sentences = await axios.post("http://localhost:4000/teacher/view/sentence", {
        cls: req.body.cls,
        chapter: req.body.chapter,
    })
    var totalno = sentences.data.result.length
    console.log(totalno)
    var nSentences = 5
    var arr = []
    var sarr = []
    if (totalno <= nSentences) {
        nSentences = totalno
    }

    while (arr.length < nSentences) {
        var r = Math.floor(Math.random() * totalno) + 1;
        if (arr.indexOf(r) === -1) arr.push(r);
    }
    console.log(arr)


    for (var i = 0; i < arr.length; i++) {
        var sid = 'CL' + String(req.body.cls) + 'CH' + String(req.body.chapter) + 'S' + String(arr[i])
        console.log(sid)
        Sentence.find({ s_id: sid }, (err, result) => {
            if (err) {
                console.log(err)
            }
            else {
                console.log(result[0].sentence)
                sarr.push(result[0])
                if(sarr.length == arr.length) {
                    Done()
                }
            }
        })
    }

    const Done = () => {
        res.json({result : sarr})
    }
    

})

module.exports = router;