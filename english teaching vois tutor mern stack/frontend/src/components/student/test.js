import { useState } from 'react';
import { Container, Grid, Box, Typography, Button, FormControl, TableRow, TableBody, TableCell, Table, ButtonGroup, TableHead, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import '../../css/App.css';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Modal } from '@mui/material';
import Swal from 'sweetalert2'
import { container, headingbutton, modalbox, tablecell } from '../../css/cssfiles'
import MicRecorder from 'mic-recorder-to-mp3'
import MicIcon from '@mui/icons-material/Mic';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

const Test = () => {
    const [curSentence, setCurSentence] = useState("")
    const [mp3Recorder, setMp3Recorder] = useState(new MicRecorder({ bitRate: 128 }))
    const [isRecording, setIsRecording] = useState(false)
    const [chapName, setChapName] = useState("")
    const [chap, setChap] = useState("")
    const [modal, setModal] = useState(false)
    const [blobURL, setBlobURL] = useState("")
    const [resultModal, setResultModal] = useState(false)
    const [curSet, setCurSet] = useState([])
    const [curSetSyllables, setCurSetSyllables] = useState([])
    const [curSetScores, setCurSetScores] = useState([])
    const [curSetExpertSyllables, setCurSetExpertSyllables] = useState([])
    const [partsArr, setPartsArr] = useState([])
    const [curpart, setCurpart] = useState(0)
    const [result, setResult] = useState({
        "word": "",
        "phoneme": [],
        "words": [],
        "user_words": [],
    })
    var SetSize = 5;
    const [student, setStudent] = useState(
        {
            name: "",
            age: "",
            cls: "",
            rollno: "",
            practiceChapter: "",
            progress: "",
            contact: "",
            address: "",
            classRecord: [],
            practiceRecord: [],
            selftests: []
        }
    )

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

    const [sentences, setSentences] = useState([])

    const navigate = useNavigate();
    const handleRecord = () => {
        setModal(true)
    }

    const RecordAudio = async (i) => {
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

                //console.log(blob)
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
                setBlobURL(curBlobURL)
            })
            .catch(e => console.log(e))

    }

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
                    "role": "Student"
                }
            })
            setStudent(res.data.user)
            setChap(res.data.user.practiceChapter)
            console.log(res.data.user.selftests)
            Swal.close()
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
        checkLogin();
    }, [])

    useEffect(() => {

        axios.post("http://localhost:4000/student/getTestSentences", {cls: student.cls.charAt(0) ,chapter : student.practiceChapter})
        .then(res => {
            setSentences(res.data.result)
            console.log(res.data.result)
        })
        .catch(err => {
            console.log(err)
        })

    }, [student])

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
        var pass = "Y"
        if (syllscore < 50.0) {
            pass = "N"
        }
        axios.post("http://localhost:4000/store", {
            type: "selfTest",
            stress: syllscore,
            fluency: result.word * 100,
            chapter: student.practiceChapter,
            sentence: curSentence.sentence,
            rollno: student.rollno,
            cls: student.cls,
            pass: pass,
        }).then(res => {
            console.log(res)
        })
            .catch(err => {
                console.log(err)
            })
        setResultModal(false)

    }

    return (
        <>
            <Container maxWidth="false" style={container} sx={{ "width": "90%" }}>
                <Typography
                    variant="h4"
                    fontWeight={300}
                    align="left"
                    color="#4800BDFF"
                >
                    {student.name}
                    <br />
                    Current Chapter: CH-{student.practiceChapter}
                </Typography>
                <hr></hr>
                <Grid container rowSpacing={{ xs: 2, md: 4 }} columnSpacing={{ xs: 2, md: 3 }}>
                    <Grid item xs={12} md={3}>
                        <Typography
                            variant="h3"
                            color="red"
                            align="left"
                            fontWeight={300}
                        >
                            TEST
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <Typography
                            variant="h5"
                            align="left"
                            component="div"
                        >
                            Current Performance:
                            <Typography
                                color="green"
                                variant="h5"
                            >
                                Fluency: 84%
                            </Typography>
                            <Typography
                                color="orange"
                                variant="h5"
                            >
                                Syllable Stress: 76%
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
                        <Typography
                            align="left"
                        >
                            <Button
                                variant="contained"
                                sx={{
                                    "backgroundColor": "#05C4E1FF",
                                    "color": "black",

                                }}
                                size="large"
                                fullWidth
                            >
                                Finish Test
                            </Button>
                        </Typography>
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
                                    "maxHeight": "70vh",
                                    "overflow": 'scroll',
                                }}
                            >
                                <colgroup>
                                    <col style={{ width: "100%" }}></col>
                                    <col style={{ width: "100%" }}></col>
                                    <col style={{ width: "100%" }}></col>
                                </colgroup>
                                <TableHead>
                                    <TableCell>
                                        Sentence
                                    </TableCell>
                                    
                                    <TableCell>
                                        Record
                                    </TableCell>
                                    
                                </TableHead>
                                <TableBody>
                                    {sentences.map((s, i) => {
                                        return (
                                            <TableRow key={s.sentence}>
                                                <TableCell
                                                    style={tablecell}
                                                >
                                                    {s.sentence}
                                                </TableCell>
                    
                                                <TableCell>

                                                    <Button
                                                        variant="contained"
                                                        sx={{
                                                            "backgroundColor": '#126ABCFF',
                                                            "borderRadius": "10px",
                                                            "color": "white"
                                                        }}
                                                        onClick={() => { setCurSentence(s); handleRecord() }}
                                                    >
                                                        Record
                                                    </Button>
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
                                Name: {student.name}
                            </Typography>
                            <Typography
                                align="left"
                                color="#4730BBFF"
                                variant="h6"
                            >
                                Class: {student.cls}
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
        </>
    )

}

export default Test