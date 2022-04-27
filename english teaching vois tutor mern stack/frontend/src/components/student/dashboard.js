import react, { useEffect } from 'react';
import { useState } from 'react';
import { Container, Grid, Box, Typography, Button, Dialog, DialogContent, TextField, TableHead, TableRow, TableBody, TableCell, Table, Paper, useMediaQuery } from '@mui/material';
import logo from '../../assets/images/teacher.png'
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Plot from 'react-plotly.js';
import { container } from '../../css/cssfiles';


const imgstyle = {
    "borderRadius": "50%",
    "height": "30%",
    "width": "30%",
    "float": "left",
    "margin": "5%"
}

const StudentDashboard = () => {

    const navigate = useNavigate()
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
            console.log(res)
            setStudent(res.data.user)
            console.log(res.data.user.selftests)
            Swal.close()
        }
        catch (err) {
            Swal.fire({
                icon: 'error',
                title: err,
                backdrop: 'white',
                allowOutsideClick: 'false',
            }).then(result => {
                if (result.isConfirmed) {
                    navigate('/')
                }
            })
        }
    }

    const getAvgStressScore = (chapterRecord) => {

        var totscore = 0.0
        for(var i = 0; i < chapterRecord.record.length ; i++)
        {
            totscore += chapterRecord.record[i].result.stress
        }
        return (totscore/chapterRecord.record.length).toFixed(2)
    }

    const getAvgFluencyScore = (chapterRecord) => {

        var totscore = 0.0
        for(var i = 0; i < chapterRecord.record.length ; i++)
        {
            totscore += chapterRecord.record[i].result.fluency
        }
        return (totscore/chapterRecord.record.length).toFixed(2)
    }

    useEffect(() => {
        checkLogin();
    }, [])

    return (
        <div>
            <Container maxWidth="false" sx={{ "width": "90%", }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={4}>
                        <Box sx={container}>
                            <Box sx={imgstyle} component="img" src={logo}>
                            </Box>
                            <Typography component="div" align="left" sx={{ "margin": "2%" }}>
                                <Typography
                                    variant="h5"
                                    sx={{ "marginTop": "8%" }}
                                >
                                    {student.name}
                                </Typography>
                                <Typography
                                    variant="h6"

                                >
                                    Class: {student.cls}
                                </Typography>
                                <Typography
                                    variant="h6"

                                >
                                    Roll No: {student.rollno}
                                </Typography>
                                <br></br>
                                <br></br>
                                <Typography
                                >
                                    Date of Birth :
                                </Typography>
                                <Typography
                                >
                                    Contact: {student.contact}
                                </Typography>
                                <Typography
                                >
                                    Address: {student.address}
                                </Typography>
                            </Typography>
                        </Box>
                        <Typography
                            variant="h5"
                            fontWeight="light"
                            align="left"
                        >
                            <br></br>
                            Current Chapter: {student.practiceChapter}
                            <br></br>

                            Total Sentences Spoken: {student.practiceRecord.length}
                            <br></br>

                            Sentences Practiced : {student.practiceRecord.length}
                            <br></br>

                            Self-Test Taken : {student.selftests.length}
                        </Typography>
                        <Box  style={{ display : 'flex' }}>
                            <Plot
                                data={[
                                    { type: 'bar', x: ["CH-1", "CH-2", "CH-3", "CH-4", "CH-5", "CH-6", "CH-7"], y: [80.0, 70.0, 90.0, 60.0, 85.0, 75.0, 80.0] },
                                ]}
                                layout={{ title: 'Progress', margin: { l: 10, r: 10, t: 40, b: 10 }, xaxis: { title: { text: 'Chapter' }, automargin: true, dtick: 1 }, yaxis: { title: { text: 'Average Progress %' }, automargin: true } }}
                                style={{
                                    "width" : "100%",
                                    flexGrow : 1
                                }}
                                config={{ "responsive": "true" }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8}>
                        <Box sx={container} style={{ height: "400px" }}>
                            <Typography
                                fontFamily="Merriweather Sans"
                                align="left"
                                variant="h4"
                                fontWeight={400}
                            >
                                Grade Sheet
                            </Typography>
                            <Table
                                sx={{
                                    display: 'block',
                                    overflow: "scroll"
                                }}
                            >
                                <colgroup>
                                    <col style={{ width: "70%" }}></col>
                                    <col style={{ width: "10%" }}></col>
                                    <col style={{ width: "10%" }}></col>
                                </colgroup>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Chapter</TableCell>
                                        <TableCell>Stress</TableCell>
                                        <TableCell>Fluency</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {
                                        student.classRecord.map(chapterRecord => {
                                            console.log(chapterRecord.record)
                                            return (
                                                <TableRow>
                                                    <TableCell>{chapterRecord.chapter}</TableCell>
                                                    <TableCell>{getAvgStressScore(chapterRecord)}</TableCell>
                                                    <TableCell>{getAvgFluencyScore(chapterRecord)}</TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </Box>
                        <Box sx={container}>
                            <Typography
                                fontFamily="Merriweather Sans"
                                align="left"
                                variant="h4"
                                fontWeight={400}
                            >
                                Self-Tests Taken
                            </Typography>
                            <Table
                                sx={{
                                    display: 'block',
                                    overflow: 'scroll',
                                    maxHeight: "300px"
                                }}
                            >
                                <colgroup>
                                    <col style={{ width: "80%" }}></col>
                                    <col style={{ width: "20%" }}></col>
                                    <col style={{ width: "20%" }}></col>

                                </colgroup>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Chapter</TableCell>
                                        <TableCell>Fluency</TableCell>
                                        <TableCell>Stress</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        student.selftests.map(test => {
                                            return (
                                                <TableRow>
                                                    <TableCell>{test.chapter}</TableCell>
                                                    <TableCell>{test.record.reduce((a, b) => a.result.fluency + b.result.fluency) / test.record.length}</TableCell>
                                                    <TableCell>{test.record.reduce((a, b) => a.result.stress + b.result.stress) / test.record.length}</TableCell>

                                                    {/*  <TableCell><Button variant="contained">Review</Button></TableCell> */}
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default StudentDashboard