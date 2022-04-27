import { useState } from 'react';
import { Container, Grid, Box, Typography, Button, TableHead, TableRow, TableBody, TableCell, Table, ButtonGroup, Paper, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Link } from 'react-router-dom';
import MicRecorder from 'mic-recorder-to-mp3'
import { Modal } from '@mui/material';
import Swal from 'sweetalert2';
import MicIcon from '@mui/icons-material/Mic';
import { container, headingbutton, modalbox, tablecell } from '../../css/cssfiles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: theme.shadows[0],
    borderRadius: 0
}));
const Evaluate = () => {

    const [cls, setCls] = useState("6B")
    const [email, setEmail] = useState("")
    const [chap, setChap] = useState("")
    const [chapName, setChapName] = useState("")
    const [sentences, setSentences] = useState([])
    const [mp3Recorder, setMp3Recorder] = useState(new MicRecorder({ bitRate: 128 }))
    const [isRecording, setIsRecording] = useState(false)
    const [blobURL, setBlobURL] = useState("")
    const [curSentence, setCurSentence] = useState({})
    const [modal, setModal] = useState(false)
    const [timesEvaluated, setTimesEvaluated] = useState([])
    const [audio, setAudio] = useState([])
    const [savedLessons, setSavedLessons] = useState([])
    const [savedLessonModal, setSavedLessonModal] = useState(false)
    const [resultModal, setResultModal] = useState(false)
    const [curSet, setCurSet] = useState([])
    const [curSetSyllables, setCurSetSyllables] = useState([])
    const [curSetScores, setCurSetScores] = useState([])
    const [curSetExpertSyllables, setCurSetExpertSyllables] = useState([])
    const [partsArr, setPartsArr] = useState([])
    const [curpart, setCurpart] = useState(0)
    const [nEvals, setNEvals] = useState(0);
    const [result, setResult] = useState({
        "word": "",
        "phoneme": [],
        "words": [],
        "user_words": [],
    })
    const [curSyllScore, setCurSyllScore] = useState(0)
    const [curFreqScore, setCurFreqScore] = useState(0)
    var SetSize = 5;
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



    useEffect(() => {
        if (localStorage.getItem("Sentence") != undefined) {
            setSentences(JSON.parse(localStorage.getItem("Sentence")))
        }
        if (localStorage.getItem("Chapter") != undefined) {
            console.log(localStorage.getItem("Chapter"))
            setChap(localStorage.getItem("Chapter"))
        }
        if (localStorage.getItem("ChapterName") != undefined) {
            console.log(localStorage.getItem("ChapterName"))
            setChapName(localStorage.getItem("ChapterName"))
        }
    }, [])
    

    
    const navigate = useNavigate();

    useEffect(() => {
        var temp = []
        for (var i = 0; i < sentences.length; i++) {
            axios.post("http://localhost:4000/teacher/getExpertAudio", { s_id: sentences[i].s_id })
                .then(res => {
                    /* console.log(res.data[0]) */
                    temp.push(new Audio(res.data[0].expertAudio))
                })
        }
        setAudio(temp)
    }, [sentences])

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

    const handleRecord = () => {
        setModal(true);
    }

    useEffect(() => {
        let temp = sentences
        let size = temp.length
        let temp2 = []
        for (let i = 0; i < size; ++i) {
            temp2.push(0)
        }
        setTimesEvaluated([...temp2])
    }, [sentences])

    const HandleClose = () => {
        setResultModal(false);

    }

    const RecordAudio = async (i) => {
        console.log(curSentence);
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

                const blobURL = URL.createObjectURL(blob)
                var mp3fromblob = new File([blob], "audiowav", { type: "audio/wav" })
                /* console.log(mp3fromblob.name)
                console.log(mp3fromblob)
                console.log(blobURL) */
                setBlobURL(blobURL)
                setIsRecording(false)
            })
            .catch(e => console.log(e))

    }

    const ViewSavedLessons = () => {

        axios.post("http://localhost:4000/teacher/getSavedLesson", {
            email: email,
            cls: cls
        }).then(res => {
            console.log(res.data.result)
            setSavedLessonModal(true)
            setSavedLessons(res.data.result)
        })
            .catch(err => {
                console.log(err)
            })
    }

    const handleLessonSelect = (lesson) => {
        setChap(lesson.chapter)
        setChapName(lesson.title)
        setSentences(lesson.sdetails)
        setSavedLessonModal(false)
        Swal.fire({
            icon: 'success',
            title: 'Lesson Loaded Successfully'
        })
    }

    const handleLessonDelete = (lesson) => {
        axios.post("http://localhost:4000/teacher/deleteLesson", {
            _id: lesson._id
        }).then(res => {
            Swal.fire({
                icon: 'success',
                title: 'Deleted Successfully'
            })
            setSavedLessonModal(false)
        })
            .catch(err => {
                console.log(err)
            })
    }

    const handleClose = () => {
        setResultModal(false)
        var tempsyllscore = (curSyllScore + +getSyllableScore()) / (nEvals + 1);
        setCurSyllScore(tempsyllscore)
        var tempfreqscore = (curFreqScore + +result.word*100) / (nEvals + 1);
        setCurFreqScore(tempfreqscore)
        setNEvals(nEvals + 1)
    }

    return (
        <div>
            <Container maxWidth="false" sx={{ "width": "90%" }}>
                <Button>
                    <Typography
                        style={headingbutton}
                        variant="h3"
                        p={2}
                    >
                        Class {cls}
                    </Typography>
                </Button>
                <hr></hr>
                <Grid container rowSpacing={{ xs: 2, md: 4 }} columnSpacing={{ xs: 2, md: 3 }}>
                    <Grid item xs={12} sm={12} md={3} mb={1}>
                        <ButtonGroup
                            style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                marginBottom: "8%"
                            }}
                        >
                            <Button
                                sx={{
                                    "backgroundColor": "#F4F3FCFF;",
                                }}
                                component={Link}
                                to='../planLesson'
                            >
                                <Typography
                                    variant="h6"
                                    color="black"
                                    fontWeight="regular"
                                >
                                    Plan Lesson
                                </Typography>
                            </Button>
                            <Button
                                sx={{
                                    "backgroundColor": "#5138CCFF"
                                }}
                                component={Link}
                                to="../evaluate"
                            >
                                <Typography
                                    variant="h6"
                                    color="white"
                                    fontWeight="light"
                                >
                                    Evaluate
                                </Typography>
                            </Button>
                        </ButtonGroup>
                        <Box style={container}>
                            <Typography
                                variant="h5"
                                align="center"
                            >
                                {chap}: {chapName}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <Typography
                            variant="h5"
                            align="left"
                            component="div"
                        >
                            Overall Session Performance:
                            <Typography
                                color="green"
                                variant="h5"

                            >
                                Fluency: {curFreqScore}%
                            </Typography>
                            <Typography
                                color="orange"
                                variant="h5"
                            >
                                Syllable Stress: {curSyllScore}%
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography
                                    align="left"
                                >
                                    <Button
                                        variant="contained"
                                        sx={{
                                            "backgroundColor": "#05C4E1FF",
                                            "color": "black",
                                        }}

                                        fullWidth
                                    >
                                        Finish Evaluation
                                    </Button>
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography
                                    align="left"
                                >
                                    <Button
                                        variant="contained"
                                        sx={{
                                            "backgroundColor": "orange",
                                            "color": "black",
                                        }}
                                        fullWidth
                                        onClick={ViewSavedLessons}
                                    >
                                        View Saved Lessons
                                    </Button>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            variant='h5'
                            align="left"
                            component='div'
                        >
                            Current Sentence: <Typography component='h5' variant='h5' color="green">  {curSentence.sentence} </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                        <Typography
                            variant="h5"
                            align="left"
                        >
                            Current Recording:
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4} align="left">
                                <audio src={blobURL} controls style={{ "width": "100%" }} />

                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Box style={container}>
                            <Typography
                                variant="h4"
                                fontFamily="Merriweather Sans"
                                style={{
                                    textDecoration: "underline"
                                }}
                                fontWeight={300}
                            >
                                {chap}: {chapName}
                            </Typography>
                            <Table
                                sx={{
                                    "display": 'block',
                                    "maxHeight": "350px",
                                    "overflow": 'scroll',
                                }}
                            >
                                <colgroup>
                                    <col style={{ width: "90%" }}></col>
                                    <col style={{ width: "10%" }}></col>
                                    <col style={{ width: "10%" }}></col>
                                </colgroup>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Sentence
                                        </TableCell>
                                        <TableCell>
                                            Expert Audio
                                        </TableCell>
                                        <TableCell>
                                            Record
                                        </TableCell>
                                        <TableCell>
                                            No of Times Evaluated
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sentences.map((s, i) => {
                                        return (
                                            <TableRow key={s}>
                                                <TableCell
                                                    style={tablecell}
                                                >
                                                    {s.sentence}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => { audio[i].play() }}
                                                    >
                                                        Expert
                                                    </Button>
                                                </TableCell>
                                                <TableCell>

                                                    <Button
                                                        variant="contained"
                                                        sx={{
                                                            "backgroundColor": '#126ABCFF',
                                                            "borderRadius": "10px",
                                                            "color": "white"
                                                        }}
                                                        onClick={() => { console.log(s); setCurSentence(s); handleRecord() }}
                                                    >
                                                        Record
                                                    </Button>
                                                </TableCell>
                                                <TableCell>
                                                    {timesEvaluated[i]}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
            <Modal
                open={modal}
                onClose={() => { setModal(false) }}
            >
                <Box sx={modalbox} style={{
                    width: "80%",
                    maxHeight: "70vh",
                    overflowY: "scroll"
                }}>
                    <Grid container rowSpacing={4}>
                        <Grid item xs={12}>
                            <Typography align="center" variant="h4" sx={{ mt: 2 }}>
                                {curSentence.sentence}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                align="center"
                            >
                                {!isRecording ?
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={RecordAudio}
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
                open={savedLessonModal}
                onClose={() => { setSavedLessonModal(false) }}

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
                                Saved Lessons
                            </Typography>
                        </Grid>
                        {savedLessons.map(lesson => {
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
                                                    Chapter {lesson.chapter}({lesson.title})
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <ul>
                                                    {lesson.sdetails.map(s => {
                                                        return (
                                                            <li>
                                                                <Typography
                                                                    variant="h6"
                                                                    fontWeight={300}
                                                                >
                                                                    {s.sentence}
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
                                                        onClick={() => handleLessonSelect(lesson)}
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
                                                        onClick={() => handleLessonDelete(lesson)}
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
                                Class: {cls}
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
        </div>
    )
}
// responseURL: "https://new-dass.s3.ap-south-1.amazonaws.com/audiowav?Content-Type=audio%2Fwav&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA2KIRL7ETQJUJE5EC%2F20220402%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220402T052729Z&X-Amz-Expires=500&X-Amz-Signature=f9b6bd35943576e561cf3435ed63d6d0a993326b1464a8d4166d80e3119b25df&X-Amz-SignedHeaders=host"


export default Evaluate