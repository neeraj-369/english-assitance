import react, { useEffect } from 'react';
import { useState } from 'react';
import { Container, Grid, Box, Typography, Button, Dialog, DialogContent, TextField, TableHead, TableRow, TableBody, TableCell, Table, Paper, useMediaQuery } from '@mui/material';
import logo from '../../assets/images/teacher.png'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/App.css';
import Plot from 'react-plotly.js';

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

const container = {
    "borderRadius": "6px",
    "boxShadow": "0px 0px 7px #333a47",
    "padding": "2%",
    "marginBottom": "2%"
}

const ClassOverview = () => {

    const classes = cssstyle()
    const navigate = useNavigate()
    const checkLogin = async () => {
        try {
            Swal.fire({
                title: 'Loading...',
                backdrop: 'true',
                allowOutsideClick: false,
                backdrop: 'grey'
            })
            Swal.showLoading()
            // await new Promise(r => setTimeout(r, 1000));
            const res = await axios.get("http://localhost:4000/login/isUserAuth", {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            })
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

    return (
        <div>
            <Container maxWidth="false" sx={{ "width": "90%", marginBottom: "2%" }}>
                <Button>
                    <Typography
                        className={classes.btn}
                        variant="h3"
                        p={2}
                    >
                        Class 6 B
                    </Typography>
                </Button>
                <hr></hr>
                <br></br>
                <Grid container rowSpacing={{ xs: 2, md: 4 }} columnSpacing={{ xs: 2, md: 3 }}>
                    {/* <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={6} md={3}>
                                <Box sx={container}>
                                    <Plot
                                        data={[
                                            {
                                                values: [19, 26, 55],
                                                labels: ['80-100%', '50-80%', '<50%'],
                                                type: 'pie'
                                            }
                                        ]}
                                        layout={{ title: 'No of students vs grade', margin: { l: 0, t: 50, r: 0, b: 0 } }}
                                        style={{
                                            width: "100%",
                                            maxHeight: "350px"
                                        }}
                                        config={{ "responsive": "true" }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid> */}
                    <Grid item xs={12} sm={12} md={4}>
                        <Box sx={container}>
                            <Typography
                                variant="h5"
                                align="center"
                            >
                                OverAll Performance
                            </Typography>
                            <Plot
                                data={[
                                    { type: 'scatter', x: ["18", "19", "20", "21", "22", "23", "24"], y: [88.0, 86.0, 90.0, 89.0, 92.0, 88.0, 90.0] },
                                ]}
                                layout={{ title: 'OverAll Performance', margin: { l: 10, r: 10, t: 40, b: 10 }, xaxis: { automargin: true, dtick: 1 }, yaxis: { title: { text: 'Accuracy %' }, automargin: true, dtick: 1 } }}
                                style={{
                                    maxHeight: "300px",

                                }}
                                config={{ "responsive": "true" }}
                            />
                            <Typography
                            >
                                7 Day Average: 90%
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <Box sx={container}>
                            <Typography
                                variant="h5"
                                align="center"
                            >
                                Fluency
                            </Typography>
                            <Plot
                                data={[
                                    { type: 'scatter', x: ["18", "19", "20", "21", "22", "23", "24"], y: [88.0, 86.0, 90.0, 89.0, 92.0, 88.0, 90.0] },
                                ]}
                                layout={{ title: 'Fluency', margin: { l: 10, r: 10, t: 40, b: 10 }, xaxis: { automargin: true, dtick: 1 }, yaxis: { title: { text: 'Accuracy %' }, automargin: true, dtick: 1 } }}
                                style={{
                                    maxHeight: "300px",
                                }}
                                config={{ "responsive": "true" }}
                            />
                            <Typography
                            >
                                7 Day Average: 90%
                            </Typography>
                        </Box>

                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <Box sx={container}>
                            <Typography
                                variant="h5"
                                align="center"
                            >
                                Syllable Stress
                            </Typography>
                            <Plot
                                data={[
                                    { type: 'scatter', x: ["18", "19", "20", "21", "22", "23", "24"], y: [88.0, 86.0, 90.0, 89.0, 92.0, 88.0, 90.0] },
                                ]}
                                layout={{ title: 'Syllable Stress', margin: { l: 10, r: 10, t: 40, b: 10 }, xaxis: { automargin: true, dtick: 1 }, yaxis: { title: { text: 'Accuracy %' }, automargin: true, dtick: 1 } }}
                                style={{
                                    maxHeight: "300px",
                                }}
                                config={{ "responsive": "true" }}
                            />
                            <Typography
                            >
                                7 Day Average: 90%
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container display="flex" justifyContent="center">
                            <Grid item xs={12} sm={12} md={3}>
                                <Typography
                                    variant="h4"
                                >
                                    Chapter-Wise Performance
                                </Typography>
                                <Plot
                                    data={[
                                        { type: 'bar', x: ["CH-1", "CH-2", "CH-3", "CH-4", "CH-5", "CH-6", "CH-7"], y: [80.0, 70.0, 90.0, 60.0, 85.0, 75.0, 80.0] },
                                    ]}
                                    layout={{ title: 'Syllable Stress', margin: { l: 10, r: 10, t: 40, b: 10 }, xaxis: { title: { text: 'Chapter' }, automargin: true, dtick: 1 }, yaxis: { title: { text: 'Average Performance %' }, automargin: true } }}
                                    style={{
                                        maxHeight: "300px",
                                    }}
                                    config={{ "responsive": "true" }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Box sx={{
                                            backgroundColor: "#4CE4FBFF",
                                            borderRadius: "5px",
                                            border: "2px solid",
                                            borderColor: "#423E58FF",
                                            height: "120px",
                                            padding: "5%"
                                        }}>
                                            <Typography
                                            >
                                                Total Sentences Spoken:
                                                <Typography
                                                    variant="h4"
                                                >
                                                    357
                                                </Typography>
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{
                                            backgroundColor: "#E4F18FFF",
                                            borderRadius: "5px",
                                            border: "2px solid",
                                            borderColor: "#423E58FF",
                                            height: "120px",
                                            padding: "5%"
                                        }}>
                                            <Typography
                                            >
                                                Improvement over past day, week, month
                                                <Typography
                                                    variant="h5"
                                                >
                                                    2%, 5%, 4%
                                                </Typography>
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{
                                            backgroundColor: "#F18F8FFF",
                                            borderRadius: "5px",
                                            border: "2px solid",
                                            borderColor: "#423E58FF",
                                            height: "120px",
                                            padding: "5%"
                                        }}>
                                            <Typography
                                            >
                                                Fluency Accuracy: 80%
                                                <br></br>
                                                Stress Accuracy : 70%
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{
                                            backgroundColor: "#5BDC77FF",
                                            borderRadius: "5px",
                                            border: "2px solid",
                                            borderColor: "#423E58FF",
                                            height: "120px",
                                            padding: "5%"
                                        }}>
                                            <Typography
                                            >
                                                Top 3 Students:
                                                <br></br>
                                                Abc
                                                <br></br>
                                                Bcd
                                                <br></br>
                                                Cde
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </Container>
        </div >
    )
}

export default ClassOverview