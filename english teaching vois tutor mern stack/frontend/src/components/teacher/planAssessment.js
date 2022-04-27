import { useState } from 'react';
import { Container, Grid, Box, Typography, Button, createTheme, Card, CardContent, CardMedia, Dialog, DialogContent, DialogTitle, FormControl, FormGroup, TextField, TableHead, TableRow, TableBody, TableCell, Table, ButtonGroup, InputLabel, Select, MenuItem, InputAdornment, IconButton, AccordionDetails } from '@mui/material';
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
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { container, headingbutton, tablecell } from '../../css/cssfiles'
import SearchIcon from "@mui/icons-material/Search";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "100%",
    maxWidth: "100vw",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}


const PlanAssessment = () => {

    const [cls, setCls] = useState("6B");
    const [email, setEmail] = useState("");
    const [chapter, setChapter] = useState([]);
    const [curChap, setCurChap] = useState("");
    const [curChapName, setCurChapName] = useState("");
    const [sentence, setSentence] = useState([]);
    const [assignedStu, setAssignedStu] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [dupAllStudents, setDupAllStudents] = useState([]);
    const [assignModal, setassignModal] = useState(false);
    const [curSentence, setCurSentence] = useState("");
    const [viewAS, setViewAS] = useState(false);
    const [searchName, setSearchName] = useState("")

    if (localStorage.getItem("Assigned") == undefined) {
        localStorage.setItem("Assigned", JSON.stringify(assignedStu))
    }

    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 1500,
        color: 'black',
        background: '#38CC77',

    })

    const navigate = useNavigate();

    const checkLogin = async () => {

        try {
            const res = await axios.get("http://localhost:4000/login/isUserAuth", {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                    "role" : "Teacher"
                }
            })
            setEmail(res.data.user.email)
        }
        catch (err) {
            navigate('/');
            alert(err.response.data.message);
        }

    }

    useEffect(() => {
        checkLogin()
    }, [])

    useEffect(() => {
        localStorage.setItem("Chapter", curChap)
    }, [curChap])

    useEffect(() => {
        axios.post("http://localhost:4000/teacher/view/chapter", { cls: cls.charAt(0) })
            .then((res) => {
                var temp = []
                temp = res.data.result
                temp.sort((a, b) => {
                    if (a.chapter > b.chapter)
                        return 1
                    else
                        return -1
                })
                setChapter(temp)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    useEffect(() => {
        if (curChap != "") {
            axios.post("http://localhost:4000/teacher/view/sentence", { cls: cls.charAt(0), chapter: curChap })
                .then(res => {
                    setSentence(res.data.result)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [curChap])

    useEffect(() => {
        if (curChap != "") {
            const c = chapter.find(ch => ch.chapter == curChap)
            setCurChapName(c.title)
        }
    }, [curChap])

    const AssignSentence = async (sen) => {

        setCurSentence(sen)
        Swal.fire({
            title: "Please Wait",
            text: "Fetching Student's list",
            backdrop: "true",
            position: "center",
            allowOutsideClick: false,
        })
        Swal.showLoading()

        axios.post("http://localhost:4000/student/", { cls: cls })
            .then((res) => {
                setAllStudents(res.data.students)
                setDupAllStudents(res.data.students)
            })
            .catch(err => {
                console.log(err)
            })

        /* await new Promise(r => setTimeout(r, 1000)); */
        Swal.close()
        setassignModal(true)

    }

    const RemoveAssigned = (sen) => {

        const temp = assignedStu
        const idx = temp.findIndex(item => { return (item.sentence == sen) })
        temp.splice(idx, 1)
        setAssignedStu([...temp])

        Toast.fire({
            icon: 'success',
            title: 'Removed Successfully'
        })
    }

    const handleModalClose = () => { setViewAS(false) }

    const ViewAddedSentences = () => {
        setViewAS(true)
    }

    useEffect(() => {

        if(searchName == "") {
            setAllStudents([...dupAllStudents])
        }
        else {
            const filteredQuery = dupAllStudents.filter(stu => {const lowercasename = stu.name.toLowerCase(); return lowercasename.includes(searchName.toLowerCase())})
            setAllStudents([...filteredQuery])
            
        }

    }, [searchName])

    const SaveLesson = () => {
        Swal.fire(
            'Saved!',
            'Lesson Saved Successfully!',
            'success'
        )
    }

    const Assign = (stu) => {
        const temp = assignedStu
        temp.push({ sentence: curSentence, stu: stu })
        setAssignedStu([...temp])
        setSearchName("")
        localStorage.setItem("Assigned", JSON.stringify(temp))
        setassignModal(false)
        Toast.fire({
            icon: 'success',
            title: 'Assigned Successfully'
        })
    }

    const getAssignedStudent = (sen) => {
        let idx = assignedStu.findIndex((item) => { return item.sentence == sen });
        if (idx != -1) {
            return <> {assignedStu[idx].stu.name} </>
        }
        else {
            return null
        }
    }

    const handleSaveAssessment = () => {

        var asdetails = []
        for(var i = 0; i < assignedStu.length ; i++)
        {   
            asdetails.push({
                sentence: assignedStu[i].sentence,
                stu: {
                    name: assignedStu[i].stu.name,
                    cls: assignedStu[i].stu.cls,
                    rollno: assignedStu[i].stu.rollno,
                }
            })
        }
       
        axios.post("http://localhost:4000/teacher/saveAssessment", {
            email: email,
            cls: cls,
            chapter: curChap,
            title: curChapName,
            details: asdetails,
        }).then(res => {
            Swal.fire(
                'Saved!',
                'Assessment Saved Successfully!',
                'success'
            )
        })
        .catch(err => {
            console.log(err)
        })

    }
    return (
        <div>
            <Container maxWidth="false" style={{ width: "90%" }}>
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
                <Grid container rowSpacing={{ xs: 2, md: 2 }} columnSpacing={{ xs: 2, md: 2 }}>
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
                                    '&:hover' : {
                                        "backgroundColor": "#5138CCFF;"
                                    }
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    color="white"
                                    fontWeight="regular"
                                    display="flex"
                                    alignItems="center"
                                >
                                    <StickyNote2Icon />
                                    Plan Assesment
                                </Typography>
                            </Button>
                            <Button
                                sx={{
                                    "backgroundColor": "#F4F3FCFF",
                                  
                                }}
                                component={Link}
                                to='../assess'
                            >
                                <Typography
                                    variant="h6"
                                    color="black"
                                    fontWeight="light"
                                    display="flex"
                                    alignItems="center"
                                >
                                    <HistoryEduIcon />
                                    Evaluate
                                </Typography>
                            </Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Box style={container}>
                            <Typography
                                variant="h5"
                                align="left"
                            >
                                Select Chapter:
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
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
                        <Button
                            sx={{
                                "backgroundColor": "#05C4E1FF",
                                "color": "black",
                                '&:hover' : {
                                    "backgroundColor": "#05C4E1FF"
                                }
                            }}
                            size="large"
                            fullWidth
                            onClick={ViewAddedSentences}
                        >
                            View Assigned Students
                        </Button>
                        <Modal
                            open={viewAS}
                            onClose={handleModalClose}
                        >
                            <Box sx={style} style={{
                                maxWidth: "80%"
                            }}>
                                <Typography variant="h5" component="h2">
                                    Assigned Students
                                </Typography>
                                <Table
                                    style={{
                                        maxHeight: "80%",
                                        overflow: "scroll",

                                    }}
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Sentence</TableCell>
                                            <TableCell>Student</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {assignedStu.map(pair => {
                                            return (
                                                <TableRow>
                                                    <TableCell
                                                        style={{
                                                            fontSize: "1.3em",
                                                            fontWeight: 300,
                                                        }}
                                                    >
                                                        {pair.sentence.sentence}
                                                    </TableCell>
                                                    <TableCell
                                                        style={{
                                                            fontSize: "1.3em",
                                                            fontWeight: 300,
                                                        }}
                                                    >
                                                        {pair.stu.name}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Modal>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
                        <Button
                            sx={{
                                "backgroundColor": "cyan",
                                "color": "black",
                                '&:hover' : {
                                    "backgroundColor": "cyan"
                                }
                            }}
                            size="large"
                            fullWidth
                            onClick={handleSaveAssessment}
                        >
                            Save Assessment
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
                        <Button
                            sx={{
                                backgroundColor: "#5BDC77FF",
                                color: "black",
                                '&:hover' : {
                                    "backgroundColor": "#5BDC77FF"
                                }
                            }}
                            size="large"
                            fullWidth
                            component={Link}
                            to={'../assess'}
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
                                fontWeight={300}
                            >
                                {curChap == "" || curChapName == "" ? <> Select a chapter to view it's sentences</> : <div> {curChap} - {curChapName} </div>}
                            </Typography>
                            {curChap == "" || curChapName == "" ? null :
                                <Table
                                    sx={{
                                        "display": 'block',
                                        "maxHeight": "450px",
                                        "overflow": 'scroll',
                                    }}
                                >
                                    <colgroup>
                                    <col style={{ width: "100%" }}></col>
                                    <col style={{ width: "100%" }}></col>
                                    <col style={{ width: "100%" }}></col>
                                </colgroup>
                                    <TableHead>
                                        <TableCell>Sentence</TableCell>
                                        <TableCell>Assign</TableCell>
                                        <TableCell>Remove</TableCell>
                                        <TableCell>Assigned To:</TableCell>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            sentence.map(s => {
                                                return (
                                                    <TableRow key={s.sentence}>
                                                        <TableCell
                                                            style={{
                                                                minWidth: "250px",
                                                                fontSize: "1.3em",
                                                                fontWeight: 300,
                                                            }}
                                                        >
                                                            {s.sentence}
                                                        </TableCell>
                                                        <TableCell>
                                                            {assignedStu.findIndex((item) => { return item.sentence == s }) == -1 ?
                                                                <Button
                                                                    sx={{
                                                                        "backgroundColor": '#00921FFF',
                                                                        "borderRadius": "10%",
                                                                        "color": "white",
                                                                        "&:hover": {
                                                                            backgroundColor: "#4DD637",
                                                                            color: "black",
                                                                        }
                                                                    }}
                                                                    onClick={() => { AssignSentence(s) }}
                                                                >
                                                                    Assign
                                                                </Button>
                                                                :
                                                                <Typography
                                                                    sx={{
                                                                        "color": "green"
                                                                    }}
                                                                >
                                                                    ASSIGNED
                                                                </Typography>
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {assignedStu.findIndex((item) => { return item.sentence == s }) != -1 ?
                                                                <Button
                                                                    sx={{
                                                                        "backgroundColor": '#EA5757FF',
                                                                        "borderRadius": "10%",
                                                                        "color": "white",
                                                                        "&:hover": {
                                                                            backgroundColor: "#DE4839",
                                                                            color: "black"
                                                                        }
                                                                    }}
                                                                    onClick={() => RemoveAssigned(s.sentence)}
                                                                >
                                                                    Remove
                                                                </Button>
                                                                :
                                                                null
                                                            }
                                                        </TableCell>
                                                        <TableCell
                                                            style={{
                                                                fontSize: "1.3em",
                                                                fontWeight: 300,
                                                            }}
                                                        >
                                                            {
                                                                getAssignedStudent(s)
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Container>
            <Dialog
                open={assignModal}
                onClose={() => { setassignModal(false) }}
                maxWidth="lg"
            >
                <DialogTitle>
                    <Typography
                        color="primary"
                        variant="h4"
                        align="left"
                        component="div"
                    >
                        Assign Sentence:
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography
                        fontSize="3vmax"
                        align="left"
                        component="div"   
                    >
                        {curSentence.sentence}
                    </Typography>
                    <TextField
                        label="Search Student"
                        fullWidth={true}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment>
                                    <IconButton>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        value={searchName}
                        onChange={(event) => setSearchName(event.target.value)}
                    // onChange={customFunction}
                    />
                    <Table
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Roll No.
                                </TableCell>
                                <TableCell>
                                    Name
                                </TableCell>
                                <TableCell>
                                    Progress
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allStudents.map(stu => {
                                return (
                                    <TableRow key={stu.name}>
                                        <TableCell
                                            style={tablecell}
                                        >
                                            {stu.rollno}
                                        </TableCell>
                                        <TableCell
                                            style={tablecell}
                                        >
                                            {stu.name}
                                        </TableCell>
                                        <TableCell
                                            style={tablecell}
                                        >
                                            {stu.progress}%
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                onClick={() => { Assign(stu) }}
                                            >
                                                Assign
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
        </div >
    )
}

export default PlanAssessment