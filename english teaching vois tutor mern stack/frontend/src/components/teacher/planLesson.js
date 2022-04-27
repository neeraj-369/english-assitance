import { useState } from 'react';
import { Container, Grid, Box, Typography, Button, FormControl, TableRow, TableBody, TableCell, Table, ButtonGroup, InputLabel, Select, MenuItem, TableHead } from '@mui/material';
import '../../css/App.css';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Modal } from '@mui/material';
import Swal from 'sweetalert2'
import { container, headingbutton, modalbox, tablecell } from '../../css/cssfiles'

const PlanLesson = () => {

    const [cls, setCls] = useState("6B");
    const [email, setEmail] = useState("");
    const [chapter, setChapter] = useState([]);
    const [curChap, setCurChap] = useState("");
    const [curChapName, setCurChapName] = useState("");
    const [sentence, setSentence] = useState([]);
    const [selectSen, setSelectSen] = useState([]);
    const [viewAS, setViewAS] = useState(false);

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
            setSelectSen([...JSON.parse(localStorage.getItem("Sentence"))])
        }
    }, [])

    const navigate = useNavigate();

    // check if the teacher is logged in
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
                    "role": "Teacher"
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

    // get all chapters of a class
    useEffect(() => {
        axios.post("http://localhost:4000/teacher/view/chapter", { cls: cls.charAt(0) })
            .then((res) => {
                var temp = res.data.result
                console.log(temp)
                temp = temp.sort((a, b) => { console.log(a); console.log(b); return a.chapter > b.chapter ? 1 : -1 })
                setChapter(temp)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    // get all sentences of a chapter
    useEffect(() => {
        localStorage.setItem("Chapter", curChap)
        setSelectSen([])
        localStorage.setItem("Sentence", JSON.stringify([]))
        if (curChap != "") {
            axios.post("http://localhost:4000/teacher/view/sentence", { cls: cls.charAt(0), chapter: curChap })
                .then(res => {
                    setSentence(res.data.result)
                    console.log(res.data.result)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [curChap])

    useEffect(() => {
        localStorage.setItem("ChapterName", curChapName)
        if (curChap != "") {
            const c = chapter.find(ch => ch.chapter == curChap)
            setCurChapName(c.title)
            localStorage.setItem("ChapterName", c.title)
        }
    }, [curChap])

    const AddSentence = async (s) => {
        setSelectSen([...selectSen, s])
        localStorage.setItem("Sentence", JSON.stringify([...selectSen, s]))
        Toast.fire({
            icon: 'success',
            title: 'Added Successfully',
        })
    }

    const RemoveSentence = (s) => {
        const deleteidx = selectSen.indexOf(s)
        selectSen.splice(deleteidx, 1)
        setSelectSen([...selectSen])
        localStorage.setItem("Sentence", JSON.stringify(selectSen))
        Toast.fire({
            icon: 'success',
            title: 'Removed Successfully'
        })
    }

    const handleModalClose = () => { setViewAS(false) }

    const ViewAddedSentences = () => {
        console.log(selectSen)
        if (selectSen.length == 0) {
            console.log("here")
            Swal.fire({
                icon: 'info',
                title: 'No Sentences Added'
            })
            return
        }
        setViewAS(true)
    }

    const SaveLesson = () => {

        axios.post("http://localhost:4000/teacher/saveLesson", {
            email: email,
            cls: cls,
            chapter: curChap,
            title: curChapName,
            sdetails: selectSen,
        }).then(res => {
            Swal.fire(
                'Saved!',
                'Lesson Saved Successfully!',
                'success'
            )
        })
        .catch(err => {
            console.log(err)
        })

    }

    // prompt whenever chapter is changed and there are sentences selected from the previous chapter
    const handleChapterChange = (event) => {

        if (selectSen.length != 0) {
            Swal.fire({
                title: 'Are you sure you want to change the Chapter?',
                text: 'All the current sentences selected will be removed.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
            }).then(result => {
                if (result.isConfirmed) {

                    Toast.fire({
                        icon: 'success',
                        title: 'Chapter Changed'
                    })

                    setCurChap(event.target.value)
                }
            })
        }

        else {
            setCurChap(event.target.value)
        }

    }

    return (
        <>
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
                    <Grid item xs={12}>
                        <ButtonGroup
                            style={{
                                display: "flex",
                                justifyContent: "flex-start",
                            }}
                        >
                            <Button
                                sx={{
                                    "backgroundColor": "#5138CCFF;",
                                }}
                                component={Link}
                                to='../planLesson'
                            >
                                <Typography
                                    variant="h6"
                                    color="white"
                                    fontWeight="regular"
                                >
                                    Plan Lesson
                                </Typography>
                            </Button>
                            <Button
                                sx={{
                                    "backgroundColor": "#F4F3FCFF"
                                }}
                                component={Link}
                                to='../evaluate'
                            >
                                <Typography
                                    variant="h6"
                                    color="black"
                                    fontWeight="light"
                                >
                                    Evaluate
                                </Typography>
                            </Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Box style={container}>
                            <Grid container spacing={1} display='flex' alignItems='center'>
                                <Grid item xs={4}>
                                    <Typography
                                        variant="h5"
                                        align="left"
                                    >
                                        Select Chapter:
                                    </Typography>

                                </Grid>
                                <Grid item xs={8}>
                                    <Typography
                                        align='left'
                                    >
                                        <FormControl
                                            fullWidth
                                        >
                                            <InputLabel>Select Chapter</InputLabel>
                                            <Select
                                                label="Select Chapter"
                                                sx={{
                                                    "margin": "2%"
                                                }}
                                                value={curChap}
                                                onChange={(event) => { handleChapterChange(event); /* console.log(event.target.value); setCurChap(event.target.value); */ }}
                                            >
                                                {chapter.map(c => {
                                                    return <MenuItem key={c.chapter} value={c.chapter}>{c.chapter}({c.title})</MenuItem>
                                                })}
                                            </Select>
                                        </FormControl>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
                        <Button
                            sx={{
                                "backgroundColor": "#05C4E1FF",
                                "color": "black",
                                "&:hover": {
                                    backgroundColor: "#12B0E8"
                                }
                            }}
                            size="large"
                            fullWidth
                            variant="contained"
                            onClick={ViewAddedSentences}
                        >
                            View Added Sentences
                        </Button>
                        <Modal
                            open={viewAS}
                            onClose={handleModalClose}

                        >
                            <Box sx={modalbox} style={{
                                width: "80%"
                            }}>
                                <Typography variant="h6" component="h2">
                                    Selected Sentences
                                </Typography>
                                <Typography sx={{ mt: 2 }} component="div">
                                    <Table
                                        sx={{
                                            display: "block",
                                            maxHeight: "70vh",
                                            overflowY: "scroll"
                                        }}
                                    >
                                        <TableBody>
                                            {selectSen.map(s => {
                                                return (
                                                    <TableRow key={s}>
                                                        <TableCell
                                                            style={{
                                                                fontSize: "1.3em"
                                                            }}
                                                        >
                                                            {s.sentence}
                                                        </TableCell>
                                                    </TableRow>)
                                            })}
                                        </TableBody>
                                    </Table>
                                </Typography>
                                <br></br>
                                <Typography
                                    align="center"
                                >
                                    <Button
                                        variant="contained"
                                        onClick={() => { setViewAS(false) }}
                                    >
                                        Close
                                    </Button>
                                </Typography>
                            </Box>
                        </Modal>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
                        <Button
                            sx={{
                                "backgroundColor": "cyan",
                                "color": "black",
                                "&:hover": {
                                    "backgroundColor": "#51E1ED"
                                }
                            }}
                            size="large"
                            fullWidth
                            variant="contained"
                            onClick={SaveLesson}
                        >
                            Save Lesson
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
                        <Button
                            sx={{
                                backgroundColor: "#5BDC77FF",
                                color: "black",
                                "&:hover": {
                                    backgroundColor: "#38CC77"
                                }
                            }}
                            size="large"
                            fullWidth
                            variant="contained"
                            component={Link}
                            to={'../evaluate'}
                        >
                            Evaluate
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Box style={container}>
                            <Typography
                                variant="h5"
                                style={{
                                    textDecoration: "underline"
                                }}
                                marginBottom="2%"
                                fontWeight={300}
                            >
                                {curChap != "" && curChapName != "" ? <div> {curChap} - {curChapName} </div> : <> Select a chapter to view it's sentences</>}
                            </Typography>
                            {curChap != "" && curChapName != "" ?
                                <Table
                                    sx={{
                                        "display": 'block',
                                        "maxHeight": "350px",
                                        "overflow": 'scroll',
                                    }}
                                >

                                    <colgroup>
                                        <col style={{ width: "100%" }}></col>
                                        <col style={{ width: "100%" }}></col>
                                        <col style={{ width: "100%" }}></col>
                                    </colgroup>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Sentence</TableCell>
                                            <TableCell>Add</TableCell>
                                            <TableCell>Remove</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            sentence.map(s => {
                                                return (
                                                    <TableRow key={s.sentence}>
                                                        <TableCell
                                                            style={tablecell}
                                                        >
                                                            {s.sentence}
                                                        </TableCell>
                                                        <TableCell>
                                                            {selectSen.indexOf(s) == -1 ?
                                                                <Button
                                                                    variant="contained"
                                                                    sx={{
                                                                        backgroundColor: '#00921FFF',
                                                                        borderRadius: "10%",
                                                                        color: "white",
                                                                        "&:hover": {
                                                                            backgroundColor: '#4DD637',
                                                                            color: "black",
                                                                        }
                                                                    }}
                                                                    onClick={() => { AddSentence(s) }}
                                                                >
                                                                    Add
                                                                </Button>
                                                                :
                                                                <Typography
                                                                    sx={{
                                                                        "color": "green"
                                                                    }}
                                                                >
                                                                    ADDED
                                                                </Typography>
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {selectSen.indexOf(s) != -1 ?
                                                                <Button
                                                                    sx={{
                                                                        "backgroundColor": '#BF3312',
                                                                        "borderRadius": "10%",
                                                                        "color": "white",
                                                                        "&:hover": {
                                                                            backgroundColor: "#DE4839",
                                                                            color: "black"
                                                                        }
                                                                    }}
                                                                    onClick={() => RemoveSentence(s)}
                                                                >
                                                                    Remove
                                                                </Button>
                                                                :
                                                                null
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>
                                : null}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default PlanLesson