import { useState } from 'react';
import { Container, Grid, Box, Typography, Button, createTheme, Card, CardContent, CardMedia, Dialog, DialogContent, DialogTitle, FormControl, FormGroup, TextField, TableHead, TableRow, TableBody, TableCell, Table, ButtonGroup, InputLabel, Select, MenuItem } from '@mui/material';
import 'react-calendar/dist/Calendar.css';
import { makeStyles } from '@mui/styles';
import '../../css/App.css';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Modal } from '@mui/material';
import Swal from 'sweetalert2'
import { useLocation } from 'react-router-dom';
import teachingIcon from '../../assets/images/teaching_icon.png'
import assessmentIcon from '../../assets/images/assessment_icon.png'

const container = {
    "borderRadius": "6px",
    "boxShadow": "0px 0px 7px #333a47",
    "padding": "2%",
    "marginBottom": "2%",
    "&:hover" : {
        "backgroundColor" : "lightblue"
    }
}

const PracticeView = () => {
    return(
        <Container maxWidth="false"  sx={{"padding" : "2%", "width" : "90%"}}>
            <Grid container columnSpacing={10} sx={{
                    height : "80vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                <Grid item xs={12} md={5}>
                    <Box sx={container}
                        style={{
                            height: "30vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundImage: "linear-gradient(to right, #12B0E8, #00d4ff)",
                            
                        }}
                    >
                        <Box
                            component="img"
                            src={teachingIcon}
                            sx={{
                                height: "100%",
                                width: "40%",
                                margin: "1%"
                            }}
                         />
                        <Typography
                            variant="h2"
                            component={Link}
                            to={'planLesson'}
                            color="black"
                        >
                            Plan Lesson
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Box sx={container}
                        style={{
                            height: "30vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundImage: "linear-gradient(to right, #12B0E8, #00d4ff)"
                        }}
                    >
                        <Box
                            component="img"
                            src={assessmentIcon}
                            sx={{
                                height: "100%",
                                width: "40%",
                                margin: "1%"
                            }}
                         />
                        <Typography
                            variant="h2"
                            component={Link}
                            to={'evaluate'}
                            color="black"
                        >
                            Train
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}

export default PracticeView