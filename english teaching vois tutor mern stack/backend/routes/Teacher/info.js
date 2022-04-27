var express = require("express");
var router = express.Router();
var session = require("express-session");
var aws = require('aws-sdk');
const axios = require('axios');
const fs = require('fs')
const Teacher = require("../../models/Teacher");
const Sentence = require("../../models/Sentence");
const SavedLesson = require("../../models/Lesson");
const SavedAssessment = require("../../models/Assessment");
const path = require('path');
const {spawn} = require('child_process');
const {PythonShell} =require('python-shell');

aws.config.update({
    region: 'ap-south-1',
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey
})



router.post("/sign_s3", (req, res) => {
    const S3_BUCKET = process.env.Bucket
    const s3 = new aws.S3();
    const fileName = req.body.fileName;
    const fileType = req.body.fileType;

    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 500,
        ContentType: fileType,
    };
    console.log(s3Params)
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err)
            res.json({
                success: false,
                error: err
            })
        }

        const returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        };

        res.json({
            success: true,
            data: { returnData }
        })
    })
})

router.post("/getfile_s3", (req, res) => {
    const S3_BUCKET = process.env.Bucket
    const s3 = new aws.S3();
    const fileName = req.body.fileName;
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
    }

    /* res.attachment(fileName)
    var fileStream = s3.getObject(s3Params).createReadStream();
    fileStream.pipe(res);
    console.log(fileStream) */

    s3.getObject(s3Params, (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            res.json(data.Body.toString('base64'))
        }
    })
})

router.post("/addExpertAudio", (req, res) => {
    console.log("Inside api call")
    Sentence.updateOne({ sentence: req.body.sentence }, {
        $set: {
            expertAudio: req.body.blob
        }
    }).then(sentence => {
        console.log("Inside then")
        res.status(200).json(sentence);
    })
        .catch(err => {
            console.log(err)
            res.status(400).json({
                message: "Cannot Update audio",
                error: err
            })
        })
})

router.post("/getExpertAudio", (req, res) => {

    Sentence.find({ s_id: req.body.s_id }, { expertAudio: 1 }, (err, audio) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error: " + err });
        }
        else {
            res.json(audio)
        }
    })
})

router.post("/edit/:id", (req, res) => {
    // Redirect to login page if user is not logged in
    if (!req.session.user) {
        res.redirect("/login");
    }
    const id = req.params.id;
    Teacher.findById(id, (err, teacher) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error: " + err });
        }
        else if (!teacher) {
            res.json({ success: false, msg: "Teacher not found" });
        }
        else if (teacher) {
            if (req.body.name) {
                teacher.name = req.body.name;
            } if (req.body.email) {
                console.log("email can be changed");
                res.json({ success: false, msg: "Email can be changed" });

            } if (req.body.password) {
                teacher.password = req.body.password;
            } if (req.body.class) {
                console.log("class can be changed, Contact Admin");
                res.json({ success: false, msg: "Class can be changed, Contact Admin" });
            } if (req.body.qualification) {
                teacher.qualification = req.body.qualification;
            } if (req.body.experience) {
                teacher.experience = req.body.experience;
            }
            Teacher.findByIdAndUpdate(id, teacher, (err, result) => {
                if (err) {
                    console.log(err);
                    res.json({ success: false, msg: "Error: " + err });
                }
                else if (!result) {
                    res.json({ success: false, msg: "Teacher not found" });
                }
                else if (result) {
                    res.json({ success: true, msg: "Teacher updated" });
                }

            });
        }
    })


})

router.get("/", (req, res) => {
    // Redirect to login if not logged in
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        res.redirect("/teacher/dashboard/:id");
    }
})

router.get("/dashboard", async (req, res) => {

    const teacher = await Teacher.findById(req.user);

    res.json({
        name: teacher.name,
        id: teacher._id
    })
})

router.post("/add", async (req, res) => {
    // Redirect to login page if user is not logged in
    /* if (!req.session.user) {
        res.redirect("/login");
    } */

    var nSentence = await axios.post("http://localhost:4000/teacher/view/sentence", {
        cls: req.body.cls,
        chapter: req.body.chapter,
    })

    var temp = 'CL' + String(req.body.cls) + 'CH' + String(req.body.chapter) + 'S' + String(nSentence.data.result.length + 1)
    const newSentence = new Sentence({
        s_id: temp,
        sentence: req.body.sentence,
        cls: req.body.cls,
        chapter: req.body.chapter,
        title: req.body.title,
        expertAudio: req.body.expertAudio,
        vois_tutor_id: req.body.vois_tutor_id,
    });
    newSentence.save((err, sentence) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error: " + err });
        }
        else {
            res.json({ success: true, msg: "Sentence added", result: sentence });
        }
    }
    )
})

// This route is for getting all the chapters of a particular class

router.post("/view/chapter", (req, res) => {
    // Redirect to login page if user is not logged in
    /* if (!req.session.user) {
        res.redirect("/login");
    } */
    cls = req.body.cls;
    // Display all chapters of a class
    Sentence.find({ cls: cls }, { _id: 0, chapter: 1, title: 1 }, async (err, sentences) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error: " + err });
        }
        else if (!sentences) {
            res.json({ success: false, msg: "No such Class found" });
        }
        else if (sentences) {
            uniquevalues = await sentences.filter((value, index, self) => {
                return self.findIndex(t => { return t.chapter === value.chapter && t.title === value.title }) === index
            })
            res.json({ success: true, msg: "Chapters found", result: uniquevalues });
        }
    })
})

// This route is for getting all the sentences of a particular chapter
router.post("/view/sentence", (req, res) => {
    // Redirect to login page if user is not logged in
    /* if (!req.session.user) {
        res.redirect("/login");
    } */
    cls = req.body.cls;
    chapter = req.body.chapter;
    // Display all sentences in a chapter
    Sentence.find({ cls: cls, chapter: chapter }, { sentence: 1, s_id: 1, _id: 0 }, (err, sentences) => {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: "Error: " + err });
        }
        else if (!sentences) {
            res.json({ success: false, msg: "No such Chapter found" });
        }
        else if (sentences) {
            res.json({ success: true, msg: "Sentences found", result: sentences });

        }
    })
})

router.post("/updateProfile", (req, res) => {

    Teacher.updateOne({ email: req.body.email }, {
        $set: {
            name: req.body.name,
            contact: req.body.contact,
            address: req.body.address
        }
    }).then(teacher => {
        res.status(200).json(teacher);
    })
        .catch(err => {
            res.status(400).json({
                message: "Cannot Update Profile. Please Contact Support",
                error: err
            })
        })
})

router.post('/saveLesson', (req, res) => {

    const newlesson = new SavedLesson({
        email: req.body.email,
        cls: req.body.cls,
        chapter: req.body.chapter,
        title: req.body.title,
        sdetails: req.body.sdetails
    })

    SavedLesson.create(newlesson).then(lesson => {
        res.status(200).send(lesson);
    })
        .catch(err => {
            console.log(err)
            res.status(400).json({ message: "Could not save Lesson. Please Contact Support" });
        })
})

router.post('/getSavedLesson', (req, res) => {

    SavedLesson.find({ email: req.body.email, cls: req.body.cls })
        .then(lessons => {
            res.status(200).json({
                message: "success",
                result: lessons
            })
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({
                message: err
            })
        })

})

router.post('/deleteLesson', (req, res) => {

    SavedLesson.findByIdAndDelete(req.body._id)
        .then(resp => {
            res.status(200).json({
                message: 'success'
            })
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({
                message: err
            })
        })
})

router.post('downloadAudio', (req, res) => {



})



router.get('/getResult', (req, res) => {

    /*  res.send("HI") */
    var { spawn } = require("child_process");

    var process = spawn('python', ["./hello.py", "Ayush"]);

    process.stdout.on('data', function (data) {
        res.send(data.toString());
    })
})


router.post("/getvoisid", (req, res) => {
    console.log(req.body.s_id);
    Sentence.find({s_id : req.body.s_id})
    .then(sen => {
        res.json(sen)
    })
    .catch(err => {
        res.send(err);
    })

})

router.post("/executepython", (req, res) => {

    const filename = req.body.fileName;
    let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
          scriptPath: '../../../../', //If you are having python_test.py script in same folder, then it's optional.
        args: [filename] //An argument which can be accessed in the script using sys.argv[1]
    };
    PythonShell.run('Sentence_diagnosis_new.py', options, function (err, result){
        if (err) throw err;
        // result is an array consisting of messages collected
        //during execution of script.
        console.log('result: ', result.toString());
        res.send(result.toString())
  });
    /* const python = spawn('python2', ["-u" ,'../../../../Sentence_diagnosis_new.py'], filename);

    python.stdout.on('end', function (data) {
        console.log('Pipe data from python script ...');
        console.log(data);
        //dataToSend = data.toString();
    });

    python.on('exit', (code) => {
        res.send("DONE");
    }) */
    

})

router.post("/store/audio", async (req, res) => {
    var vois_tutor_id = ""
    axios.post("http://localhost:4000/teacher/getvoisid", { s_id: req.body.s_id })
        .then(axres => {
            console.log(axres.data);
            vois_tutor_id = axres.data[0].vois_tutor_id;
            console.log(vois_tutor_id);
           
            const audio_str = req.body.student_audio_str;
            // console.log(audio_str.split('base64,//')[1])
            let temp = audio_str.split('base64,')[1];
            
            // save the base 64 string to local storage as an audio file
            // and then save the file name to the database
            const filePath = path.join(__dirname, '../../../../voistutor-server/');
            const stufileName = vois_tutor_id + '.wav';
            const stufile = filePath + stufileName;
            fs.writeFile(stufile, temp, { encoding: 'base64' }, function (err) {
                if (err) {
                    console.log(err);
                    res.json({ success: false, msg: "Error: " + err });
                }
                else {
                    res.json({file : stufileName})
                }
            })
        });
})

router.post('/saveAssessment', (req, res) => {

    const newAssessment = new SavedAssessment({
        email: req.body.email,
        cls: req.body.cls,
        chapter: req.body.chapter,
        title: req.body.title,
        details: req.body.details
    })

    SavedAssessment.create(newAssessment).then(asmt => {
        res.status(200).send(asmt);
    })
        .catch(err => {
            console.log(err)
            res.status(400).json({ message: "Could not save Assessment. Please Contact Support" });
        })
})

router.post('/getSavedAssessment', (req, res) => {

    SavedAssessment.find({ email: req.body.email, cls: req.body.cls })
        .then(asmts => {
            res.status(200).json({
                message: "success",
                result: asmts
            })
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({
                message: err
            })
        })
})




module.exports = router;