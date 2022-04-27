import { useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Box, DialogContent, Divider } from "@mui/material";
import logo from '../../assets/images/teacher.png'
import logo1 from '../../assets/images/4.png'
import logo2 from '../../assets/images/2.png'
import logo8 from '../../assets/images/8.png'
import logo9 from '../../assets/images/9.png'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Modal } from "@mui/material";
import { Typography } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from "@mui/material";
import { cyan, deepPurple, orange, purple, red, pink, teal, lightBlue } from '@mui/material/colors';
import { responsiveFontSizes } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import { Dialog } from "@mui/material";
import { TableHead, TableRow, TableBody, TableCell, Table } from '@mui/material';
import theme from "../common/theme";
import { useEffect } from "react";
const container = {
    "border-radius": "6px",
    "box-shadow": "0px 0px 7px #333a47",
    "padding": "2%",
    "margin-bottom": "2%"
}


function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

const DetailedReport = (props) => {
    const navigate = useNavigate();
    const [student, setStudent] = useState(
        {
            name: "",
            age: "",
            email: "",
            cls: "",
            rollno: "",
            practiceChapter: "",
            classChapter: "",
            progress: "",
            contact: "",
            address: "",
            classRecord: [],
            practiceRecord: [],
            selftests: []
        }
    )


    useEffect(() => {
        axios.post("http://localhost:4000/student/getStudent", {
            cls: localStorage.getItem("Class"),
            rollno: localStorage.getItem("RollNo")
        }).then(res => {
            console.log(res.data.students[0])
            setStudent(res.data.students[0])
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const getAvgFlueScore = () => {

        var totfreq = 0.0
        var nsen = 0
        for (var i = 0; i < student.classRecord.length; i++) {
            for (var j = 0; j < student.classRecord[i].record.length; j++) {
                totfreq += student.classRecord[i].record[j].result.fluency
                nsen++
            }
        }
        //console.log(totfreq)
        return (totfreq / nsen).toFixed(2)
    }

    const getAvgSyllScore = () => {

        var totsyll = 0.0
        var nsen = 0
        for (var i = 0; i < student.classRecord.length; i++) {
            //console.log(student.classRecord[i])
            for (var j = 0; j < student.classRecord[i].record.length; j++) {
                totsyll += student.classRecord[i].record[j].result.stress
                nsen++
            }
        }

        return (totsyll / nsen).toFixed(2)
    }


    return (
        <div>
            <Container maxWidth="false" sx={{ "padding": "2%", "width": "90%" }}>
                <Grid container
                    direction="row"
                    justifyContent="center"
                    alignItems="center">
                    <Box
                        sx={{
                            backgroundColor: "#CBF7FEFF",
                            borderRadius: "5px",
                            padding: "1%",
                            boxShadow: "0px 0px 7px #333a47"
                        }}
                    >
                        <Typography variant="h4" align="center">Student Report</Typography>
                    </Box>
                </Grid>
                <br></br>
                <hr></hr>
                <br></br>
                <br></br>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={3}>
                        <Box>
                            <Box
                                component="img"
                                sx={{
                                    height: '35%',
                                    width: '95%',
                                    maxHeight: 300,
                                    maxWidth: 300,
                                    borderRadius: '15px',
                                    alignItem: "center",
                                }}
                                alt="Logo"
                                src={logo1}
                            >
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={9}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography
                                    variant="h6"
                                    align="left"
                                    fontWeight={300}
                                >
                                    Name : {student.name}
                                    <br></br>
                                    Class : {student.cls}
                                    <br></br>
                                    Roll No: {student.rollno}
                                    <br></br>
                                    Current Chapter: {student.classChapter}
                                    <br></br>
                                    Progress: {student.progress}%
                                    <br></br>
                                    <LinearProgressWithLabel value={student.progress} />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={container}>
                                    <Typography
                                        align="left"
                                        color="primary"
                                        variant="h5"
                                        sx={{
                                            fontStyle: 'italic',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        Overall Performance
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        align="left"
                                        fontWeight={300}
                                        color="#27262EFF"
                                    >
                                        Fluency:{getAvgFlueScore()}%
                                        <br></br>
                                        Syllable Stress: {getAvgSyllScore()}%
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Typography
                        >
                            Performance over time
                        </Typography>
                        <Box>
                            <Box
                                component="img"
                                sx={{
                                    height: '100%',
                                    width: '100%',
                                    maxHeight: 400,
                                    maxWidth: 300,
                                    borderRadius: '3px',
                                    alignItem: "center",
                                }}
                                alt="Logo"
                                src={logo2}
                            >
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Paper elevation={3} style={{ maxHeight: "310px", overflow: 'scroll', padding: "2%", borderRadius: 10, boxShadow: 10, }}>
                            <Grid container>
                                {
                                    student.classRecord.map(chapterRecord => {
                                        return (
                                            chapterRecord.record.map(record => {
                                                return (
                                                    <>
                                                        <Grid item xs={12} md={7}  >
                                                            <Typography
                                                                align="left"
                                                            >
                                                                Chapter: {chapterRecord.chapter}
                                                            </Typography>
                                                            <Typography
                                                                align="left"
                                                            >
                                                                Sentence: {record.sentence}
                                                            </Typography>
                                                            {
                                                                record.result.pass == "Y" ?
                                                                    <Typography
                                                                        align="left"
                                                                        color="green"
                                                                    >
                                                                        Result: Passed
                                                                    </Typography> :
                                                                    <Typography
                                                                        align="left"
                                                                        color="red"
                                                                    >
                                                                        Progress: Failed
                                                                    </Typography>
                                                            }
                                                            {
                                                                record.result.pass == "Y" ?
                                                                    <Typography
                                                                        align="left"
                                                                        color="green"
                                                                    >
                                                                        Progress: Increased by 5%
                                                                    </Typography> :
                                                                    <Typography
                                                                        align="left"
                                                                        color="red"
                                                                    >
                                                                        Progress: Not Increased
                                                                    </Typography>
                                                            }
                                                        </Grid>
                                                        <Grid item xs={12} md={3}>
                                                            <Typography
                                                                align="left"
                                                                textDecoration="underline"
                                                            >
                                                                Metrics
                                                            </Typography>
                                                            <Typography
                                                                align="left"
                                                            >
                                                                Fluency: {record.result.fluency}
                                                            </Typography>
                                                            <Typography
                                                                align="left"
                                                            >
                                                                Syllable Stress: {record.result.stress}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={2} display="flex" alignItems="center" justifyContent="center">
                                                            <Box
                                                                component="img"
                                                                sx={{
                                                                    height: '90px',
                                                                    width: '60px',
                                                                    alignItem: "left",
                                                                    borderTopLeftRadius: '10px',
                                                                    borderBottomLeftRadius: '10px',
                                                                    marginRight: "5%"
                                                                }}
                                                                alt="Logo"
                                                                src={logo8}
                                                            >
                                                            </Box>
                                                            Success
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <hr />
                                                        </Grid>
                                                    </>
                                                )
                                            })
                                        )
                                    })
                                }
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container >
        </div >
    );
};

export default DetailedReport;
