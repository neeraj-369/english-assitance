import { useState } from 'react';
import { Container, Grid, Box, Typography, Button, createTheme, Card, CardContent, CardMedia, Dialog, DialogContent, DialogTitle, FormControl, FormGroup, TextField, TableHead, TableRow, TableBody, TableCell, Table, ButtonGroup, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import 'react-calendar/dist/Calendar.css';
import { makeStyles } from '@mui/styles';
import '../../css/App.css';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Tabs, Tab } from '@mui/material';
import { Modal } from '@mui/material';
import Swal from 'sweetalert2'
import { useAlert } from "react-alert";
import { useLocation } from 'react-router-dom';
import { DialogActions } from '@mui/material';
import { Paper } from '@mui/material';
import logo1 from '../../assets/images/4.png'
import theme from '../common/theme';
import MicRecorder from 'mic-recorder-to-mp3'
import MicIcon from '@mui/icons-material/Mic';
import { container, headingbutton, modalbox, tablecell } from '../../css/cssfiles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

const cssstyle = makeStyles({
    btn: {
        background: "#87BF18FF;",
        borderRadius: "0px",
        border: "1px solid black",
        marginBottom: "3%",
        fontFamily: "Open Sans",
        color: "black",
    },
    btn2: {
        backgroundColor: 'green',
        '&:hover': {
            backgroundColor: "#3F2BA6FF;",
        }
    }
})

const useStyles = makeStyles({
    color: {
        backgroundColor: 'black'
    }
})

const Assess = () => {
    const classes = useStyles()
    const [cls, setCls] = useState("6B")
    const [chapter, setChapter] = useState("");
    const [email, setEmail] = useState("")
    const [savedAssessments, setSavedAssessments] = useState([])
    const [savedAssessmentModal, setSavedAssessmentModal] = useState(false)
    const [assigned, setAssigned] = useState([])
    const [curSentence, setCurSentence] = useState({})
    const [curStu, setCurStu] = useState({});
    const [modal, setModal] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [mp3Recorder, setMp3Recorder] = useState(new MicRecorder({ bitRate: 128 }))
    const [blobURL, setBlobURL] = useState([])
    const [resultModal, setResultModal] = useState(false)
    const [curSet, setCurSet] = useState([])
    const [curSetSyllables, setCurSetSyllables] = useState([])
    const [curSetScores, setCurSetScores] = useState([])
    const [curSetExpertSyllables, setCurSetExpertSyllables] = useState([])
    const [partsArr, setPartsArr] = useState([])
    const [curpart, setCurpart] = useState(0)
    const [evaluatedStu, setEvaluatedStu] = useState([])
    const [result, setResult] = useState({
        "word": "",
        "phoneme": [],
        "words": [],
        "user_words": [],
    })
    const navigate = useNavigate()
    var SetSize = 5;
    /* const result = {
        "word": "0.98",
        "phoneme": ["0.88", "0.97", "0.97", "0.93", "0.98", "0.92", "0.97", "0.99", "1.00"],
        "words": [{ "name": "my", "syls": ["m ay"], "color": "red" },
        { "name": "younger", "syls": ["y ah ng", "g ah"], "color": "null" },
        { "name": "brother", "syls": ["b r ah", "dh ah"], "color": "null" },
        { "name": "likes", "syls": ["l ay k s"], "color": "null" },
        { "name": "to", "syls": ["t ih"], "color": "null" },
        { "name": "act", "syls": ["ae k t"], "color": "null" },
        { "name": "rough", "syls": ["r ah f"], "color": "null" },
        { "name": "and", "syls": ["ae n"], "color": "green" },
        { "name": "tough", "syls": ["t ah f"], "color": "null" }],
        "colors": ["0.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00"],
        "details": [{ "text": "Fine" }, { "text": "Fine" }, { "text": "Fine" }, { "text": "Fine" }, { "text": "Fine" }, { "text": "Fine" }, { "text": "Fine" }, { "text": "Fine" }, { "text": "Fine" }, { "text": "Fine" }],
        "user_words": [{ "name": "my", "syls": ["m ay"], "color": "red" },
        { "name": "younger", "syls": ["y ah ng", "g ah"], "color": "null" },
        { "name": "brother", "syls": ["b r ah", "dh ah"], "color": "null" },
        { "name": "likes", "syls": ["l ay k s"], "color": "null" },
        { "name": "to", "syls": ["t ih"], "color": "null" },
        { "name": "act", "syls": ["ae k t"], "color": "null" },
        { "name": "rough", "syls": ["r ah f"], "color": "null" },
        { "name": "and", "syls": ["ae n"], "color": "green" },
        { "name": "tough", "syls": ["t ah f"], "color": "null" }],
        "user_colors": ["0.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00"],
        "user_details": [{ "text": "Fine" }, { "text": "Fine" }, { "text": "Fine" }, { "text": "Fine" }, { "text": "Fine" }, { "text": "Fine" }, { "text": "Fine" }, { "text": "Fine" }, { "text": "Fine" }, { "text": "" }
        ]
    } */
    useEffect(() => {
        setAssigned(JSON.parse(localStorage.getItem("Assigned")))
    }, [])

    useEffect(() => {

        var temp = []
        for(var i = 0 ; i < assigned.length; i++)
        {
            temp.push("")
        }
        setBlobURL([...temp])
    }, [assigned])
    /*  useEffect(() => {
 
         const temp = {
             rollno: curStu.rollno,
             result: {
                 syllable: getSyllableScore(),
                 fluency: "",
             }
         }
 
         evaluatedStu.push(temp);
 
     }, [result]) */

    const checkLogin = async () => {
        try {
            Swal.fire({
                title: 'Loading...',
                backdrop: 'true',
                allowOutsideClick: false,
                backdrop: 'grey'
            })
            Swal.showLoading()
            /* await new Promise(r => setTimeout(r, 1000)); */
            const res = await axios.get("http://localhost:4000/login/isUserAuth", {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                    "role": "Teacher",
                }
            })
            Swal.close()
            setEmail(res.data.user.email)
        }
        catch (err) {
            Swal.fire({
                icon: 'error',
                title: err.response.data.message,
                backdrop: 'white',
                allowOutsideClick: 'false',
            }).then(result => {
                if (result.isConfirmed) {
                    navigate('/')
                }
            })
        }
    }

    useEffect(() => {
        checkLogin()
    }, [])

    useEffect(() => {

        if (localStorage.getItem("Chapter") != undefined) {
            setChapter(localStorage.getItem("Chapter"))
        }

    }, [])

    const getSyllableScore = () => {

        var totscore = 0.0
        for (var i = 0; i < result.phoneme.length; i++) {
            totscore += +result.phoneme[i]
        }
        var score = totscore / result.phoneme.length
        return (score * 100).toFixed(2)
    }

    const getColor = (i) => {

        var totscore = 0.0
        var StartIdx = i * SetSize
        var itrs = 0
        for (var i = StartIdx; i < StartIdx + SetSize; i++) {
            if (i == result.user_words.length)
                break;
            else {
                totscore += +result.phoneme[i]
            }
            itrs++;
        }
        var avgscore = totscore / itrs
        if (avgscore >= 0.9) {
            return "green"
        }
        else if (avgscore >= 0.8 && avgscore <= 0.9) {
            return "yellow"
        }
        else {
            return "red"
        }
    }

    useEffect(() => {
        var temp = []
        var tempsyl = []
        var tempsylword = []
        var tempscores = []
        var expsyl = []
        var expsylword = []
        for (var i = 0; i < SetSize; i++) {
            if (i == result.user_words.length)
                break;
            else {
                temp.push(result.user_words[i].name)
                tempscores.push(result.phoneme[i])
                result.user_words[i].syls.map(syl => {
                    var tmp = syl.split(' ')
                    tmp.map(e => tempsylword.push(e))
                    console.log(tempsylword)
                })
                tempsyl.push(tempsylword)
                tempsylword = []

                result.words[i].syls.map(syl => {
                    var tmp = syl.split(' ')
                    tmp.map(e => expsylword.push(e))
                    console.log(expsylword)
                })
                expsyl.push(expsylword)
                expsylword = []
            }
        }
        setCurSet([...temp])
        setCurSetScores([...tempscores])
        setCurSetSyllables([...tempsyl])
        setCurSetExpertSyllables([...expsyl])
    }, [result])


    const displayNextSet = () => {


        var wordIdx = result.user_words.findIndex(item => item.name == curSet[SetSize - 1])
        if (wordIdx == result.user_words.length - 1) {
            return;
        }
        var part = Math.floor(wordIdx / SetSize + 1)
        var temp = []
        var tempsyl = []
        var tempsylword = []
        var tempscores = []
        var expsyl = []
        var expsylword = []
        for (var i = wordIdx + 1; i < SetSize + wordIdx + 1; i++) {
            if (i == result.user_words.length)
                break;
            else {
                temp.push(result.user_words[i].name)
                tempscores.push(result.phoneme[i])
                result.user_words[i].syls.map(syl => {
                    var tmp = syl.split(' ')
                    tmp.map(e => tempsylword.push(e))
                    console.log(tempsylword)
                })
                tempsyl.push(tempsylword)
                tempsylword = []

                result.words[i].syls.map(syl => {
                    var tmp = syl.split(' ')
                    tmp.map(e => expsylword.push(e))
                    console.log(expsylword)
                })
                expsyl.push(expsylword)
                expsylword = []
            }
        }
        setCurSet([...temp])
        setCurSetScores([...tempscores])
        setCurSetSyllables([...tempsyl])
        setCurpart(part)
        setCurSetExpertSyllables([...expsyl])
    }

    const displayPrevSet = () => {

        var temp = []
        var tempsyl = []
        var tempsylword = []
        var tempscores = []
        var expsyl = []
        var expsylword = []
        var wordIdx = result.user_words.findIndex(item => item.name == curSet[0])
        var StartIdx = wordIdx - SetSize > 0 ? wordIdx - SetSize : 0;
        var part = Math.floor(StartIdx / SetSize)
        for (var i = StartIdx; i < StartIdx + SetSize; i++) {
            if (i == result.user_words.length)
                break;
            else {
                temp.push(result.user_words[i].name)
                tempscores.push(result.phoneme[i])
                result.user_words[i].syls.map(syl => {
                    var tmp = syl.split(' ')
                    tmp.map(e => tempsylword.push(e))
                    console.log(tempsylword)
                })
                tempsyl.push(tempsylword)
                tempsylword = []

                result.words[i].syls.map(syl => {
                    var tmp = syl.split(' ')
                    tmp.map(e => expsylword.push(e))
                    console.log(expsylword)
                })
                expsyl.push(expsylword)
                expsylword = []
            }
        }
        setCurSet([...temp])
        setCurSetScores([...tempscores])
        setCurSetSyllables([...tempsyl])
        setCurpart(part)
        setCurSetExpertSyllables([...expsyl])
    }

    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 1500,
        color: 'black',
        background: '#38CC77',
    })

    const Record = (pair) => {

        setCurSentence(pair.sentence)
        setCurStu(pair.stu)
        setModal(true)
    }

    const StartRecording = () => {

        setIsRecording(true)
        mp3Recorder.start()
            .then(() => {
                setIsRecording(true)
            })
            .catch(e => {
                console.log(e)
            })

    }

    const StopRecording = async (i) => {
        setModal(false)
        Swal.fire({
            title: "Please Wait",
            text: "Uploading Recording",
            backdrop: "true",
            position: "center",
            allowOutsideClick: false,
        })
        Swal.showLoading()
        /* await new Promise(r => setTimeout(r, 2000)); */
        mp3Recorder
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {
                Swal.close();
                Toast.fire({
                    icon: 'success',
                    title: 'Recorded Successfully'
                })
                console.log(blob)
                var base64audio;
                var reader = new FileReader();
                reader.readAsDataURL(blob);
                Swal.fire({
                    title: "Please Wait",
                    text: "Fetching Result",
                    backdrop: "true",
                    position: "center",
                    allowOutsideClick: false,
                })
                Swal.showLoading()
                reader.onloadend = () => {
                    console.log(reader.result)
                    base64audio = reader.result;
                    axios.post("http://localhost:4000/teacher/store/audio", {
                        student_audio_str: base64audio,
                        s_id: curSentence.s_id,
                    }).then(res => {
                        console.log(res.data)
                        axios.post("http://localhost:5000/vois", {
                            file: res.data.file,
                        }).then(res => {
                            console.log(res)
                            setResult(res.data)
                            localStorage.setItem("Result", JSON.stringify(res.data))
                            setResultModal(true);
                            Swal.close();
                            Toast.fire({
                                icon: 'success',
                                title: 'Result Fetched'
                            })

                        })
                    })
                }

                const curBlobURL = URL.createObjectURL(blob)
                //var mp3fromblob = new File([blob], "audiowav", { type: "audio/wav" })
                /* console.log(mp3fromblob.name)
                console.log(mp3fromblob)
                console.log(blobURL) */
                var temp = blobURL
                var idx = assigned.findIndex(pair => pair.sentence.sentence == curSentence.sentence)
                console.log(idx)
                temp[idx] = curBlobURL
                setBlobURL([...temp])
                setIsRecording(false)
                /* axios.post("http://localhost:4000/aws/sign_s3", {
                    fileName: mp3fromblob.name,
                    fileType: mp3fromblob.type
                })
                    .then(res => {
                        console.log(res)
                        var returnData = res.data.data.returnData
                        var signedRequest = returnData.signedRequest
                        var url = returnData.url
                        var options = {
                            headers: {
                                'Content-Type': mp3fromblob.type
                            }
                        }

                        axios.put(signedRequest, mp3fromblob, options)
                            .then(res => {
                                console.log("Response from s3")
                                console.log(res)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }) */




                /*  reader.onloadend = function () {
                     var base64data = reader.result;
                     console.log(base64data);
                     axios.post("http://localhost:4000/teacher/addExpertAudio", {
                         sentence: curSentence,
                         blob: base64data
                     })
                         .then(res =>
                             console.log(res)
                         )
                 } */

            })
            .catch(e => console.log(e))

    }

    useEffect(() => {
        {
            var parts = Math.floor(result.user_words.length / SetSize) + 1;
            if (result.user_words.length % SetSize == 0) {
                parts = parts - 1;
            }
            var tmp = []
            for (var i = 0; i < parts; i++) {
                tmp.push(i)
            }
            setPartsArr([...tmp])
        }
    }, [result])

    const handleClose = () => {

        const syllscore = getSyllableScore()
        const temp = {
            sentence: curSentence.sentence,
            rollno: curStu.rollno,
            result: {
                syllable: syllscore,
                fluency: result.word * 100,
            }
        }
        console.log(temp)
        evaluatedStu.push(temp);
        var pass = "Y"
        if (syllscore < 50.0) {
            pass = "N"
        }
        axios.post("http://localhost:4000/store", {
            type: "individualTest",
            stress: syllscore,
            fluency: result.word * 100,
            chapter: chapter,
            sentence: curSentence.sentence,
            rollno: curStu.rollno,
            cls: curStu.cls,
            pass: pass,
        }).then(res => {
            console.log(res)
        })
            .catch(err => {
                console.log(err)
            })
        setResultModal(false)

    }
    const ViewSavedAssessments = () => {

        axios.post("http://localhost:4000/teacher/getSavedAssessment", {
            email: email,
            cls: cls
        }).then(res => {
            console.log(res.data.result)
            setSavedAssessmentModal(true)
            setSavedAssessments(res.data.result)
        })
            .catch(err => {
                console.log(err)
            })

    }

    const handleAssessmentSelect = (asmt) => {

        setChapter(asmt.chapter)
        setAssigned(asmt.details)
        setSavedAssessmentModal(false)

    }

    const handleAssessmentDelete = () => {

    }

    return (
        <div>
            <Container maxWidth="false"
                sx={{
                    "width": "90%",
                }}
            >
                <Button>
                    <Typography
                        style={headingbutton}
                        variant="h3"
                        p={2}
                    >
                        Class 6B
                    </Typography>
                </Button>
                <hr></hr>
                <Grid container rowSpacing={5}>
                    <Grid item xs={12} sx={{ marginBottom: "1%" }}>
                        <Grid container>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    onClick={ViewSavedAssessments}
                                >
                                    View Saved Assessments
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    onClick={() => {navigate('../../dashboard')}}    
                                >
                                    Finish Assessment
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <br />
                    {assigned.map((pair, i) => {
                        return (
                            <Grid item xs={12} sx={container}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={3}>
                                        <Box>
                                            <Box
                                                component="img"
                                                sx={{
                                                    maxHeight: 300,
                                                    maxWidth: 300,
                                                    borderRadius: '15px',
                                                    alignItem: "left",
                                                }}
                                                alt="Logo"
                                                src={logo1}
                                            >
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography
                                            variant="h5"
                                            align="left"
                                        >
                                            {pair.stu.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            align="left"
                                        >
                                            Assigned Sentence: {pair.sentence.sentence}
                                        </Typography>
                                        <br></br>
                                        <br></br>
                                        <Typography
                                            align="left"
                                        >
                                            {evaluatedStu.findIndex(stu => stu.rollno == pair.stu.rollno && stu.sentence == pair.sentence.sentence) == -1 ?
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => { Record(pair) }}
                                                >
                                                    Record
                                                </Button>
                                                :
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    disabled
                                                    onClick={() => { Record(pair) }}
                                                >
                                                    Record
                                                </Button>
                                            }
                                        </Typography>
                                        <br></br>
                                        <br></br>

                                        <Typography
                                            align="left"
                                            fullWidth
                                        >
                                            <audio src={blobURL[i]} controls />
                                        </Typography>
                                        <br></br>
                                        {/* <Button
                                                onClick={getResult}
                                            >
                                                Get Result
                                            </Button> */}
                                    </Grid>
                                    <Grid item xs={12} md={5}>
                                        {evaluatedStu.findIndex(stu => stu.rollno == pair.stu.rollno && stu.sentence == pair.sentence.sentence) == -1 ? null :
                                            <>
                                                <Typography
                                                    variant="h4"
                                                    color="green"
                                                    align="left"
                                                >
                                                    Evaluated
                                                </Typography>
                                                <Typography
                                                    variant="h5"
                                                    color="blue"
                                                    align="left"
                                                >
                                                    Result:
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    align="left"
                                                >
                                                    Syllable Score: {evaluatedStu[evaluatedStu.findIndex(stu => stu.rollno == pair.stu.rollno && stu.sentence == pair.sentence.sentence)].result.syllable}

                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    align="left"
                                                >
                                                    Fluency Score: {evaluatedStu[evaluatedStu.findIndex(stu => stu.rollno == pair.stu.rollno && stu.sentence == pair.sentence.sentence)].result.fluency}
                                                </Typography>
                                            </>
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        )
                    })}
                </Grid>
            </Container>
            <Modal
                open={modal}
                onClose={() => { setModal(false) }}
            >
                <Box sx={modalbox} style={{
                    width: "60%",
                    maxHeight: "70vh",
                    overflowY: "scroll"
                }}>
                    <Grid container rowSpacing={4}>
                        <Grid item xs={12}>
                            <Typography align="center" variant="h5" sx={{ mt: 2 }}>
                                {curSentence.sentence}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography
                                align="center"
                            >
                                <Button
                                    variant="contained"
                                    onClick={() => { setModal(false) }}
                                    sx={{
                                        backgroundColor: "red",
                                        '&:hover': {
                                            backgroundColor: "pink"
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography
                                align="center"
                            >
                                {!isRecording ?
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={StartRecording}
                                    >
                                        Start Recording
                                    </Button>
                                    :
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={StopRecording}
                                    >
                                        <MicIcon />
                                        Stop Recording
                                    </Button>
                                }
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
            <Modal
                open={resultModal}
                onClose={() => { setResultModal(false) }}
            >
                <Box
                    sx={modalbox}
                    style={{
                        width: "70%",
                        maxHeight: "80%",
                        overflow: 'scroll'
                    }}
                >
                    <Grid container rowSpacing={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Grid item xs={12}>
                            <Typography
                                align="center"
                                variant="h4"
                                fontFamily="Merriweather Sans"
                                color="green"
                            >
                                RESULT
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                align="left"
                                color="#4730BBFF"
                                variant="h6"
                            >
                                Name: {curStu.name}
                            </Typography>
                            <Typography
                                align="left"
                                color="#4730BBFF"
                                variant="h6"
                            >
                                Class: {curStu.cls}
                            </Typography>
                            <Typography
                                align="left"
                                color="#4730BBFF"
                                variant="h6"
                            >
                                Sentence: {curSentence.sentence}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                variant="h6"
                            >
                                <Grid container display="flex" alignItems="center">
                                    <Grid item xs={4}>
                                        Syllable Score: {getSyllableScore()}%
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Progress style={{ width: "80%" }} percent={getSyllableScore()} />
                                    </Grid>
                                </Grid>
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                variant="h6"
                            >
                                <Grid container display="flex" alignItems="center">
                                    <Grid item xs={4}>
                                        Fluency Score: {result.word * 100}%
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Progress style={{ width: "80%" }} percent={result.word * 100} />
                                    </Grid>
                                </Grid>
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container display="flex" alignItems="center">
                                <Grid item xs={1}>
                                    <IconButton
                                        onClick={displayPrevSet}
                                    >
                                        <ChevronLeftIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={10}>
                                    <Grid container>
                                        {partsArr.map(i => {
                                            var bgcolor = getColor(i)
                                            return (
                                                i == curpart ?
                                                    <Grid item xs={12 / partsArr.length} display="flex" alignItems="center" sx={{
                                                        border: "2px solid black",
                                                        height: "100px"
                                                    }}>
                                                        <Box
                                                            sx={{
                                                                height: "50%",
                                                                width: "100%",
                                                                backgroundColor: bgcolor
                                                            }}
                                                        >
                                                            <Typography
                                                                color={bgcolor}
                                                            >
                                                                ''
                                                            </Typography>
                                                        </Box>

                                                    </Grid>
                                                    :
                                                    <Grid item xs={12 / partsArr.length} display="flex" alignItems="center" sx={{
                                                        height: "100px"
                                                    }}>
                                                        <Box
                                                            sx={{
                                                                height: "50%",
                                                                width: "100%",
                                                                backgroundColor: bgcolor
                                                            }}
                                                        >
                                                            <Typography
                                                                color={bgcolor}
                                                            >
                                                                ''
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                            )
                                        })}
                                    </Grid>
                                </Grid>
                                <Grid item xs={1}>
                                    <IconButton
                                        onClick={displayNextSet}
                                    >
                                        <ChevronRightIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container sx={{
                                border: "2px solid black",
                                padding: "2%"
                            }}>
                                {/* <Grid item xs={2} sx={{ fontSize: "1.3em" }}>
                                    <Grid container rowSpacing={3} sx={{ display: "flex", alignItems: "center" }}>
                                        <Grid item xs={12} sx={{ height: "60px" }}>
                                            Words
                                        </Grid>
                                        <Grid item xs={12} sx={{ height: "60px" }}>
                                            Scores
                                        </Grid>
                                        <Grid item xs={12} sx={{ height: "60px" }}>
                                            Syllables
                                        </Grid>
                                    </Grid>
                                </Grid> */}
                                <Grid item xs={12} sx={{ fontSize: "1.3em" }}>
                                    <Grid container rowSpacing={3}>
                                        <Grid item xs={3} sx={{
                                            height: "60px",
                                            display: "flex",
                                            alignItems: "center"
                                        }}>
                                            Words
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Grid container columnSpacing={8} sx={{
                                                backgroundColor: '#2696EB4A',
                                                height: "60px",
                                                display: "flex",
                                                alignItems: "center"
                                            }}>
                                                {curSet.map(word => {
                                                    return (
                                                        <>
                                                            <Grid item xs={12 / curSet.length} display="flex" justifyContent="center">
                                                                {word}
                                                            </Grid>
                                                        </>
                                                    )
                                                })}
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={3} sx={{
                                            height: "60px",
                                            display: "flex",
                                            alignItems: "center"
                                        }}>
                                            Scores
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Grid container columnSpacing={8} sx={{
                                                backgroundColor: '#5BDC7775',
                                                height: "60px",
                                                display: "flex",
                                                alignItems: "center"
                                            }}>
                                                {curSetScores.map(score => {
                                                    return (
                                                        <>
                                                            <Grid item xs={12 / curSet.length} display="flex" justifyContent="center">
                                                                {score}
                                                            </Grid>
                                                        </>
                                                    )
                                                })}
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={3} sx={{
                                            height: "60px",
                                            display: "flex",
                                            alignItems: "center"
                                        }}>
                                            Student Syllables
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Grid container columnSpacing={8}
                                                sx={{
                                                    backgroundColor: '#5BDC77FF',
                                                    height: "60px",
                                                    display: "flex",
                                                    alignItems: "center"
                                                }}
                                            >
                                                {curSetSyllables.map(syl => {
                                                    return (
                                                        <Grid item xs={12 / curSet.length} display="flex" justifyContent="center">
                                                            {syl.map(sy => <>{sy}-</>)}
                                                        </Grid>
                                                    )
                                                })}
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={3} sx={{
                                            height: "60px",
                                            display: "flex",
                                            alignItems: "center"
                                        }}>
                                            Expert Syllables
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Grid container columnSpacing={8}
                                                sx={{
                                                    backgroundColor: '#5BDC77FF',
                                                    height: "60px",
                                                    display: "flex",
                                                    alignItems: "center"
                                                }}
                                            >
                                                {curSetExpertSyllables.map(syl => {
                                                    return (
                                                        <Grid item xs={12 / curSet.length} display="flex" justifyContent="center">
                                                            {syl.map(sy => <>{sy}-</>)}
                                                        </Grid>
                                                    )
                                                })}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="center">
                            <Button
                                variant="contained"
                                onClick={handleClose}
                            >
                                Close
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
            <Modal
                open={savedAssessmentModal}
                onClose={() => { setSavedAssessmentModal(false) }}

            >
                <Box sx={modalbox} style={{
                    overflowY: 'scroll',
                    maxHeight: '80%',
                    width: '80%'
                }}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography
                                variant="h3"
                                fontWeight={300}
                                align="center"
                                gutterBottom
                            >
                                Saved Assessments
                            </Typography>
                        </Grid>
                        {savedAssessments.map(asmt => {
                            return (
                                <Grid item xs={12}>
                                    <Box style={container}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography
                                                    align="left"
                                                    variant="h4"
                                                    fontWeight={300}
                                                >
                                                    Chapter {asmt.chapter}({asmt.title})
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <ul>
                                                    {asmt.details.map(d => {
                                                        return (
                                                            <li>
                                                                <Typography
                                                                    variant="h6"
                                                                    fontWeight={300}
                                                                >
                                                                    {d.sentence.sentence} - {d.stu.name}
                                                                </Typography>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography
                                                    align="center"
                                                >
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => handleAssessmentSelect(asmt)}
                                                    >
                                                        Select
                                                    </Button>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography
                                                    align="center"
                                                >
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => handleAssessmentDelete(asmt)}
                                                        sx={{
                                                            backgroundColor: 'red'
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Box>
            </Modal>
        </div>
    )
}

export default Assess
