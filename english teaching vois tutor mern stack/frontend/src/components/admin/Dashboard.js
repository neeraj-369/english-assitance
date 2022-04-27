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

const container = {
    "borderRadius": "6px",
    "boxShadow": "0px 0px 7px #333a47",
    "padding": "2%",
    "marginBottom": "2%"
}

const imgstyle = {
    "borderRadius": "50%",
    "height": "300px",
    "width": "300px",
    "float": "left",
    "margin": "5%"
}


const AdminDashboard = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [item, setItem] = useState('/4.png');
    const [dob, setDob] = useState("")
    const [contactNo, setContactNo] = useState("")
    const [curqualf, setCurqualf] = useState("")
    const [allQualf, setAllQualf] = useState([])
    const [address, setAddress] = useState("")
    const [curexp, setCurexp] = useState("");
    const [allExp, setAllExp] = useState([])

    const navigate = useNavigate()

    const AddQual = () => {

        if (curqualf == "") {
            Swal.fire({
                icon: 'warning',
                title: 'Please Enter Qualification'
            })
            return
        }

        const temp = allQualf;
        temp.push(curqualf)
        setAllQualf([...temp])
        setCurqualf("")
    }

    const ClearQual = (i) => {
        const temp = allQualf
        temp.splice(i, 1)
        setAllQualf([...temp])
    }

    const AddExp = () => {

        if (curexp == "") {
            Swal.fire({
                icon: 'warning',
                title: 'Please Enter Experience'
            })
            return
        }

        const temp = allExp;
        temp.push(curexp)
        setAllExp([...temp])
        setCurexp("")

    }

    const ClearExp = (i) => {
        const temp = allExp
        temp.splice(i, 1)
        setAllExp([...temp])
    }

    const CheckForm = () => {

        if (name == "") {
            Swal.fire({
                icon: 'warning',
                title: 'Please Enter Name'
            })
            return false
        }
        else if (email == "") {
            Swal.fire({
                icon: 'warning',
                title: 'Please Enter Email'
            })
            return false
        }
        else if (password == "") {
            Swal.fire({
                icon: 'warning',
                title: 'Please Enter Password'
            })
            return false
        }
        else if (dob == "") {
            Swal.fire({
                icon: 'warning',
                title: 'Please Enter Date of Birth'
            })
            return false
        }
        else if (contactNo == "") {
            Swal.fire({
                icon: 'warning',
                title: 'Please Enter Contact Number'
            })
            return false
        }
        else if (address == "") {
            Swal.fire({
                icon: 'warning',
                title: 'Please Enter Address'
            })
            return false
        }

        return true
    }

    const ClearForm = () => {
        setName("")
        setEmail("")
        setPassword("")
        setDob("")
        setContactNo("")
        setAddress("")
        setCurqualf("")
        setAllQualf([])
        setCurexp("")
        setAllExp([])
        setItem('/4.png')
    }

    const handleSubmit = () => {

        if (CheckForm()) {

            const newTeacher = {
                name: name,
                email: email,
                password: password,
                dob: new Date(dob),
                contact: contactNo,
                address: address,
                qualification: allQualf,
                experience: allExp,
                image: item,
            }

            Swal.fire({
                title: "Please Wait",
                text: "Uploading Recording",
                backdrop: "true",
                position: "center",
                allowOutsideClick: false,
            })
            Swal.showLoading()

            axios.post("http://localhost:4000/register/registerTeacher", newTeacher)
                .then(res => {
                    Swal.close()
                    Swal.fire({
                        icon: 'success',
                        title: 'Teacher Added Successfully'
                    })
                    ClearForm()
                    navigate('../admindashboard')
                })
                .catch(err => {
                    console.log(err)
                    Swal.fire({
                        icon: 'error',
                        title: err.response.data.message
                    })
                })
        }
    }
    return (
        <>
            <Container maxWidth="false" sx={{ width: "90%", padding: "2%" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} display='flex' alignItems='center' justifyContent='center'>
                        <Avatar sx={{ bgcolor: 'pink', height: '100px', width: '100px' }}>
                            <PersonAddAltIcon />
                        </Avatar>
                        <Typography
                            variant="h2"
                            color="secondary"
                            sx={{
                                marginBottom: "3%"
                            }}
                        >
                            Teacher Registration
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} >

                                    <Box sx={{ align: "center" }}>
                                        <Typography
                                            align="center"
                                        >
                                            <Box sx={imgstyle} component="img" src={item} />
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography
                                        variant="h6"
                                    >
                                        <FileBase64
                                            type="file"
                                            multiple={false}
                                            onDone={({ base64 }) => { setItem(base64); console.log(base64); }}
                                        />
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={2} display="flex" alignItems="center">
                                <Typography
                                    fontSize="1.5rem"
                                    required
                                    align="left"
                                >
                                    Name :
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={10}>
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
                            <Grid item xs={12} md={2} display="flex" alignItems="center">
                                <Typography
                                    fontSize="1.5rem"
                                    align="left"
                                >
                                    Email :
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={10}>
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
                            <Grid item xs={12} md={2} display="flex" alignItems="center">
                                <Typography
                                    fontSize="1.5rem"
                                    align="left"
                                >
                                    Password :
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={10}>
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
                            <Grid item xs={12} md={2} display="flex" alignItems="center">
                                <Typography
                                    fontSize="1.5rem"
                                    align="left"
                                >
                                    DOB:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={10}>
                                <Typography
                                    align="left"
                                >
                                    <TextField
                                        type="date"
                                        value={dob}
                                        onChange={(event) => { setDob(event.target.value); }}
                                    ></TextField>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={2} display="flex" alignItems="center">
                                <Typography
                                    fontSize="1.5rem"
                                    align="left"
                                >
                                    Contact No:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={10}>
                                <Typography
                                    align="left"
                                >
                                    <TextField
                                        value={contactNo}
                                        onChange={(event) => { setContactNo(event.target.value) }}
                                    ></TextField>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={2} display="flex" alignItems="center">
                                <Typography
                                    fontSize="1.5rem"
                                    align="left"
                                >
                                    Address:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={10}>
                                <Typography
                                    align="left"
                                >
                                    <TextField
                                        value={address}
                                        multiline
                                        rows={3}
                                        onChange={(event) => { setAddress(event.target.value) }}
                                    ></TextField>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={2} display="flex" alignItems="center">
                                <Typography
                                    fontSize="1.5rem"
                                    align="left"
                                >
                                    Qualification:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <TextField
                                    value={curqualf}
                                    fullWidth
                                    onChange={(event) => { setCurqualf(event.target.value) }}
                                ></TextField>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={AddQual}
                                >
                                    Add Qualification
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={4} display="flex" alignItems="center">
                                <Typography
                                    fontSize="1.5rem"
                                    align="left"
                                >
                                    Added Qualifications:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <ul>
                                    {allQualf.map((q, i) => {
                                        return (
                                            <li>
                                                <Typography
                                                    align='left'
                                                    variant='body1'
                                                >
                                                    {q}
                                                    <Tooltip title="Clear">
                                                        <IconButton
                                                            color="primary"
                                                            onClick={(i) => { ClearQual(i) }}
                                                        >
                                                            <ClearIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Typography>

                                            </li>
                                        )
                                    })}
                                </ul>
                            </Grid>
                            <Grid item xs={12} md={2} display="flex" alignItems="center">
                                <Typography
                                    fontSize="1.5rem"
                                    align="left"
                                >
                                    Experience:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <TextField
                                    value={curexp}
                                    onChange={(event) => { setCurexp(event.target.value) }}
                                    fullWidth
                                ></TextField>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={AddExp}
                                >
                                    Add Experience
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography
                                    fontSize="1.5rem"
                                    align="left"
                                >
                                    Added Experiences:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <ul>
                                    {allExp.map((exp, i) => {
                                        return (
                                            <li>
                                                <Typography
                                                    align='left'
                                                    variant='body1'
                                                >
                                                    {exp}
                                                    <Tooltip title="Clear">
                                                        <IconButton
                                                            color="primary"
                                                            onClick={(i) => { ClearExp(i) }}
                                                        >
                                                            <ClearIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Typography>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default AdminDashboard