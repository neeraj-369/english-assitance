var express = require("express");
var router = express.Router();

var Student = require("../../models/Students");
var classRecord = require("../../models/Class");
var fs = require("fs");

router.post("/", (req, res) => {

    // type indicates whether the sentence is from class,selftest, individual test.
    var type = req.body.type;
    var stress = req.body.stress;
    var fluency = req.body.fluency;
    var chapter = req.body.chapter;
    var sentence = req.body.sentence;
    var rollno = req.body.rollno;
    var cls = req.body.cls;
    var pass = req.body.pass;
    if (type == "individualTest") {
        // Update student record by appending the sentence and result to the record, when chapter matches  for classRecord, else create a new entry for chpater and append the sentence and result
        Student.findOne({
            rollno: rollno,
            cls: cls
        }).then(stu => {
            console.log(stu)
            if (stu.classRecord == []) {
                if (pass == "Y") {
                    Student.findOneAndUpdate({
                        rollno: rollno,
                        cls: cls
                    }, {
                        $inc: {
                            progress: 5,
                        }
                    }).then((val) => {
                        Student.findOneAndUpdate({
                            rollno: rollno,
                            cls: cls
                        }, {
                            $push: {
                                classRecord: {
                                    chapter: chapter,
                                    record: [{
                                        sentence: sentence,
                                        result: {
                                            stress: stress,
                                            fluency: fluency,
                                            pass: pass
                                        }
                                    }]
                                }
                            },
                        }).then(rec => { console.log(rec); res.json(rec) })
                            .catch(err => { console.log(err); res.json(err) })
                    })
                }
                else {
                    Student.findOneAndUpdate({
                        rollno: rollno,
                        cls: cls
                    }, {
                        $push: {
                            classRecord: {
                                chapter: chapter,
                                record: [{
                                    sentence: sentence,
                                    result: {
                                        stress: stress,
                                        fluency: fluency,
                                        pass: pass
                                    }
                                }]
                            }
                        },
                    }).then(rec => { console.log(rec); res.json(rec) })
                        .catch(err => { console.log(err); res.json(err) })

                }
            }
            else if (stu.classRecord.findIndex(stuRecord => stuRecord.chapter == chapter) == -1) {
                console.log("HERE")
                if (pass == "Y") {
                    Student.findOneAndUpdate({
                        rollno: rollno,
                        cls: cls
                    }, {
                        $inc: {
                            progress: 5,
                        }
                    }).then(val => {
                        Student.findOneAndUpdate({
                            rollno: rollno,
                            cls: cls
                        }, {
                            $push: {
                                classRecord: {
                                    chapter: chapter,
                                    record: [{
                                        sentence: sentence,
                                        result: {
                                            stress: stress,
                                            fluency: fluency,
                                            pass: pass
                                        }
                                    }]
                                }
                            },
                        }).then(rec => { console.log(rec); res.json(rec) })
                            .catch(err => { console.log(err); res.json(err) })
                    })
                }
                else {
                    Student.findOneAndUpdate({
                        rollno: rollno,
                        cls: cls
                    }, {
                        $push: {
                            classRecord: {
                                chapter: chapter,
                                record: [{
                                    sentence: sentence,
                                    result: {
                                        stress: stress,
                                        fluency: fluency,
                                        pass: pass
                                    }
                                }]
                            }
                        },
                    }).then(rec => { console.log(rec); res.json(rec) })
                        .catch(err => { console.log(err); res.json(err) })
                }
            }
            else {
                if (pass == "Y") {
                    Student.updateOne({
                        rollno: rollno,
                        cls: cls
                    }, {
                        $inc: {
                            progress: 5,
                        }
                    }).then((val) => {
                        console.log(val)
                        Student.findOneAndUpdate({
                            rollno: rollno,
                            cls: cls,
                            classRecord: {
                                $elemMatch: {
                                    chapter: chapter
                                }
                            }
                        }, {
                            $push: {
                                "classRecord.$.record": {
                                    sentence: sentence,
                                    result: {
                                        stress: stress,
                                        fluency: fluency,
                                        pass: pass
                                    }
                                }
                            }
                        }).then(rec => { console.log(rec); res.json(rec) })
                            .catch(err => { console.log(err); res.json(err) })
                    })
                }
                else {
                    Student.findOneAndUpdate({
                        rollno: rollno,
                        cls: cls,
                        classRecord: {
                            $elemMatch: {
                                chapter: chapter
                            }
                        }
                    }, {
                        $push: {
                            "classRecord.$.record": {
                                sentence: sentence,
                                result: {
                                    stress: stress,
                                    fluency: fluency,
                                    pass: pass
                                }
                            }
                        }
                    }).then(rec => { console.log(rec); res.json(rec) })
                        .catch(err => { console.log(err); res.json(err) })

                }
            }
        })
    }
    else if (type == "selfTest") {

        Student.findOne({
            rollno: rollno,
            cls: cls
        }).then(stu => {
            console.log(stu)
            if (stu.classRecord == []) {
                if (pass == "Y") {
                    Student.findOneAndUpdate({
                        rollno: rollno,
                        cls: cls
                    }, {
                        $inc: {
                            practiceProgress: 5,
                        }
                    }).then((val) => {
                        Student.findOneAndUpdate({
                            rollno: rollno,
                            cls: cls
                        }, {
                            $push: {
                                selftests: {
                                    chapter: chapter,
                                    record: [{
                                        sentence: sentence,
                                        result: {
                                            stress: stress,
                                            fluency: fluency,
                                            pass: pass
                                        }
                                    }]
                                }
                            },
                        }).then(rec => { console.log(rec); res.json(rec) })
                            .catch(err => { console.log(err); res.json(err) })
                    })
                }
                else {
                    Student.findOneAndUpdate({
                        rollno: rollno,
                        cls: cls
                    }, {
                        $push: {
                            selftests: {
                                chapter: chapter,
                                record: [{
                                    sentence: sentence,
                                    result: {
                                        stress: stress,
                                        fluency: fluency,
                                        pass: pass
                                    }
                                }]
                            }
                        },
                    }).then(rec => { console.log(rec); res.json(rec) })
                        .catch(err => { console.log(err); res.json(err) })

                }
            }
            else if (stu.classRecord.findIndex(stuRecord => stuRecord.chapter == chapter) == -1) {
                console.log("HERE")
                if (pass == "Y") {
                    Student.findOneAndUpdate({
                        rollno: rollno,
                        cls: cls
                    }, {
                        $inc: {
                            practiceProgress: 5,
                        }
                    }).then(val => {
                        Student.findOneAndUpdate({
                            rollno: rollno,
                            cls: cls
                        }, {
                            $push: {
                                selftests: {
                                    chapter: chapter,
                                    record: [{
                                        sentence: sentence,
                                        result: {
                                            stress: stress,
                                            fluency: fluency,
                                            pass: pass
                                        }
                                    }]
                                }
                            },
                        }).then(rec => { console.log(rec); res.json(rec) })
                            .catch(err => { console.log(err); res.json(err) })
                    })
                }
                else {
                    Student.findOneAndUpdate({
                        rollno: rollno,
                        cls: cls
                    }, {
                        $push: {
                            selftests: {
                                chapter: chapter,
                                record: [{
                                    sentence: sentence,
                                    result: {
                                        stress: stress,
                                        fluency: fluency,
                                        pass: pass
                                    }
                                }]
                            }
                        },
                    }).then(rec => { console.log(rec); res.json(rec) })
                        .catch(err => { console.log(err); res.json(err) })
                }
            }
            else {
                if (pass == "Y") {
                    Student.updateOne({
                        rollno: rollno,
                        cls: cls
                    }, {
                        $inc: {
                            practiceProgress: 5,
                        }
                    }).then((val) => {
                        console.log(val)
                        Student.findOneAndUpdate({
                            rollno: rollno,
                            cls: cls,
                            selftests: {
                                $elemMatch: {
                                    chapter: chapter
                                }
                            }
                        }, {
                            $push: {
                                "selftests.$.record": {
                                    sentence: sentence,
                                    result: {
                                        stress: stress,
                                        fluency: fluency,
                                        pass: pass
                                    }
                                }
                            }
                        }).then(rec => { console.log(rec); res.json(rec) })
                            .catch(err => { console.log(err); res.json(err) })
                    })
                }
                else {
                    Student.findOneAndUpdate({
                        rollno: rollno,
                        cls: cls,
                        selftests: {
                            $elemMatch: {
                                chapter: chapter
                            }
                        }
                    }, {
                        $push: {
                            "selftests.$.record": {
                                sentence: sentence,
                                result: {
                                    stress: stress,
                                    fluency: fluency,
                                    pass: pass
                                }
                            }
                        }
                    }).then(rec => { console.log(rec); res.json(rec) })
                        .catch(err => { console.log(err); res.json(err) })
                }
            }
        })
        
    } else if (type == "classOverview") {
        // Update class record by appending the sentence and result to the record, when chapter matches  classRecord, else create a new entry for chpater and append the sentence and result in classRecord


        // update the stress and fluency of the class with adding new values and average of all

        var class_ = req.body.class;

        classRecord.findOneAndUpdate({
            name: class_
        }, {

            // set the values of stress and fluency to the new values using stress = count*stress + stress/count+1
            $set: {
                stress: (classRecord.count * classRecord.stress + stress) / classRecord.count + 1,
                fluency: (classRecord.count * classRecord.fluency + fluency) / classRecord.count + 1
            },

            // increase the value of count by 1
            $inc: {
                count: 1
            },

            $push: {
                classRecord: {
                    chapter: chapter,
                    stress: stress,
                    fluency: fluency
                }
            }
        }, { new: true, upsert: true }, (err, student) => {
            if (err) {
                console.log(err);
            } else {
                console.log(student);
            }
        }



        );


    }


});


module.exports = router;
