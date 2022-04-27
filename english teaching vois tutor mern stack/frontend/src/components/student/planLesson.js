import { useState } from 'react';
import { Container, Grid, Box, Typography, Button, FormControl, TableRow, TableBody, TableCell, Table, ButtonGroup, TableHead, InputLabel, Select, MenuItem } from '@mui/material';
import '../../css/App.css';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Modal } from '@mui/material';
import Swal from 'sweetalert2'
import { container, headingbutton, modalbox, tablecell } from '../../css/cssfiles'

const PlanLessonS = () => {
    const [chapter, setChapter] = useState([]);
    const [curChap, setCurChap] = useState("");
    const [curChapName, setCurChapName] = useState("");
    const [sentence, setSentence] = useState([]);
    const [selectSen, setSelectSen] = useState([]);
    const [viewAS, setViewAS] = useState(false);
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
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 1500,
        color: 'black',
        background: '#38CC77',

    })

    useEffect(() => {
        localStorage.setItem("Sentence", JSON.stringify([]))
    }, [])

    const navigate = useNavigate();

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
        axios.post("http://localhost:4000/teacher/view/chapter", { cls: student.cls.charAt(0) })
            .then((res) => {
                var temp = res.data.result
                console.log(temp)
                temp = temp.sort((a, b) => { console.log(a); console.log(b); return a.chapter > b.chapter ? 1 : -1 })
                setChapter(temp)
            })
            .catch(err => {
                console.log(err)
            })
    }, [student])

    useEffect(() => {
        localStorage.setItem("Chapter", curChap)

        if (curChap != "") {
            axios.post("http://localhost:4000/teacher/view/sentence", { cls: student.cls.charAt(0), chapter: curChap })
                .then(res => {
                    setSentence(res.data.result)
                    console.log(res.data.result)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [curChap, student])

    useEffect(() => {
        localStorage.setItem("ChapterName", curChapName)
        if (curChap != "") {
            const c = chapter.find(ch => ch.chapter == curChap)
            setCurChapName(c.title)
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

    const RemoveSentence = (sen) => {
        const deleteidx = selectSen.indexOf(sen)
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

    return (
        <div>
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
                                to='../practice'
                            >
                                <Typography
                                    variant="h6"
                                    color="white"
                                    fontWeight="regular"
                                >
                                    Select Sentences
                                </Typography>
                            </Button>
                            <Button
                                sx={{
                                    "backgroundColor": "#F4F3FCFF"
                                }}
                                component={Link}
                                to='../train'
                            >
                                <Typography
                                    variant="h6"
                                    color="black"
                                    fontWeight="light"
                                >
                                    Train
                                </Typography>
                            </Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Box style={container}>
                            <Grid container spacing={1} display="flex" alignItems="center">
                                <Grid item xs={4}>
                                    <Typography
                                        variant="h5"
                                        align="left"
                                    >
                                        Select Chapter:
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
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
                                            onChange={(event) => { console.log(event.target.value); setCurChap(event.target.value); }}
                                        >
                                            {chapter.map(c => {
                                                return <MenuItem key={c.chapter} value={c.chapter}>{c.chapter}({c.title})</MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
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
                            to={'../train'}
                        >
                            Train
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
                                    "maxHeight": "400px",
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
        </div>
    )
}

export default PlanLessonS