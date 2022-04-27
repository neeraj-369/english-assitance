import react, { useEffect } from 'react';
import { useState } from 'react';
import { Container, Grid, Box, Typography, Button, TextField, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import FileBase64 from 'react-file-base64';
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Avatar } from '@mui/material';
import MicRecorder from 'mic-recorder-to-mp3'
import { Modal } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import { ExcelRenderer, OutTable } from 'react-excel-renderer';
import DownloadIcon from '@mui/icons-material/Download';
import template from '../../assets/student_template/template.xlsx';
import fileDownload from 'js-file-download'

const RegisterStudent = () => {

    const [state, setState] = useState({});
    const [fileName, setFileName] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [contactNo, setContactNo] = useState("")
    const [address, setAddress] = useState("")
    const [rollno, setRollno] = useState("")
    const [cls, setCls] = useState("")

    const fileHandler = (event) => {
        let fileObj = event.target.files[0];
        ExcelRenderer(fileObj, (err, resp) => {
            if (err) {
                console.log(err);
            }
            else {
                setState({
                    cols: resp.cols,
                    rows: resp.rows
                });
                console.log(resp.rows)
            }
        });
    }

    const SubmitExcel = () => {

        for (var i = 1; i < state.rows.length; i++) {
            if (state.rows[i].length > 0) {
                Swal.fire({
                    title: "Please Wait",
                    text: "Uploading Data",
                    backdrop: "true",
                    position: "center",
                    allowOutsideClick: false,
                })
                Swal.showLoading()
                axios.post("http://localhost:4000/register/registerStudent", {
                    name: state.rows[i][0],
                    rollno: state.rows[i][1],
                    contact: state.rows[i][2],
                    email: state.rows[i][3],
                    password: state.rows[i][4],
                    cls: state.rows[i][5],
                })
                    .then(res => {
                        Swal.close()
                        Swal.fire({
                            icon: 'success',
                            title: 'Successfully Uploaded'
                        })
                        Swal.close()
                        console.log(res.data)
                    })
                    .catch(err => {
                        
                        console.log(err);
                    })
            }
        }
    }

    const ClearForm = () => {

        setName("")
        setEmail("")
        setPassword("")
        setCls("")
        setRollno("")
        setAddress("")
        setContactNo("")

    }

    const SubmitForm = () => {

        axios.post("http://localhost:4000/register/registerStudent", {
            name: name,
            rollno: rollno,
            email: email,
            password: password,
            cls: cls,
            contact: contactNo,
            address: address,
        })
            .then(res => {
                Swal.fire({
                    icon: 'success',
                    title: 'Successfully Uploaded',
                    body: 'Student Added Successfully'
                })
            })
            .catch(err => {
                Swal.fire({
                    icon: 'error',
                    title: 'Cannot Register Student'
                })
                console.log(err)
            })

        ClearForm()
    }

    return (
        <>
            <Container maxWidth="false" sx={{ "width": "90%", padding: "2%" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} display="flex" alignItems="center" justifyContent="center">
                        <Typography
                            variant="h2"
                            color="secondary"
                        >
                            Register Student
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <hr />
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography
                                    variant="h4"
                                    fontWeight={300}
                                    sx={{
                                        marginBottom: "3%"
                                    }}
                                >
                                    Fill the Form
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4} display="flex" alignItems="center">
                                <Typography
                                    fontSize="1.5rem"
                                    required
                                    align="left"
                                >
                                    Name :
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Typography
                                    align="left"
                                >
                                    <TextField
                                        label="Name*"
                                        value={name}
                                        onChange={(event) => { setName(event.target.value) }}
                                    ></TextField>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4} display="flex" alignItems="center">
                                <Typography
                                    fontSize="1.5rem"
                                    align="left"
                                >
                                    Email :
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Typography

                                    align="left"
                                >
                                    <TextField
                                        label="Email*"
                                        value={email}
                                        onChange={(event) => { setEmail(event.target.value) }}
                                    ></TextField>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4} display="flex" alignItems="center">
                                <Typography
                                    fontSize="1.5rem"
                                    align="left"
                                >
                                    Password :
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Typography
                                    align="left"
                                >
                                    <TextField
                                        label="Password*"
                                        type='password'
                                        value={password}
                                        onChange={(event) => { setPassword(event.target.value) }}
                                    ></TextField>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4} display="flex" alignItems="center">
                                <Typography
                                    fontSize="1.5rem"
                                    align="left"
                                >
                                    Class:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Typography
                                    align="left"
                                >
                                    <TextField
                                        label="Class*"
                                        value={cls}
                                        onChange={(event) => { setCls(event.target.value) }}
                                    ></TextField>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4} display="flex" alignItems="center">
                                <Typography
                                    fontSize="1.5rem"
                                    align="left"
                                >
                                    Roll No:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Typography
                                    align="left"
                                >
                                    <TextField
                                        label="Roll No*"
                                        value={rollno}
                                        onChange={(event) => { setRollno(event.target.value) }}
                                    ></TextField>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4} display="flex" alignItems="center">
                                <Typography
                                    fontSize="1.5rem"
                                    align="left"
                                >
                                    Address:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Typography
                                    align="left"
                                >
                                    <TextField
                                        value={address}
                                        label="Address"
                                        maxRows={3}
                                        onChange={(event) => { setAddress(event.target.value) }}
                                    ></TextField>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4} display="flex" alignItems="center">
                                <Typography
                                    fontSize="1.5rem"
                                    align="left"
                                >
                                    Contact No:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Typography
                                    align="left"
                                >
                                    <TextField
                                        label="Contact No"
                                        value={contactNo}
                                        onChange={(event) => { setContactNo(event.target.value) }}
                                    ></TextField>
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    disableElevation
                                    onClick={SubmitForm}
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Typography
                            variant="h3"
                        >
                            OR
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography
                                    variant="h4"
                                    fontWeight={300}
                                    sx={{
                                        marginBottom: "3%"
                                    }}
                                >
                                    Upload an Excel(.xlsx) File
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography
                                    variant="body1"
                                >
                                    Please Download the template file and fill it according to the given format.
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Tooltip
                                    title="Download Template"
                                >
                                    <a href={template} download>
                                        <IconButton
                                            color="success"

                                        >
                                            <DownloadIcon />
                                        </IconButton>
                                    </a>
                                </Tooltip>
                                <Button
                                    variant="contained"
                                    component="label"
                                >
                                    Upload File
                                    <input
                                        type="file"
                                        hidden
                                        accept='.xlsx'
                                        onChange={(e) => { console.log(e); setFileName(e.target.files[0].name); fileHandler(e) }}
                                    />
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                {fileName != "" ? <>Uploaded File: {fileName} </> : null}
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    onClick={SubmitExcel}
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default RegisterStudent