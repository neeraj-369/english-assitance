import { useEffect } from 'react';
import { useState } from 'react';
import { Container, Grid, Box, Typography, Button, Dialog, DialogContent, TextField, TableHead, TableRow, TableBody, TableCell, Table } from '@mui/material';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { container, imgstyle } from '../../css/cssfiles'

// function to calculate age from a date string
const getAge = (dateString) => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Dashboard page
const Dashboard = () => {
    const current = new Date();
    const navigate = useNavigate()


    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    // Teacher's Details as an object
    const [teacher, setTeacher] = useState({
        name: "",
        email: "",
        contact: "",
        dob: "",
        address: "",
        classes: [],
        qualification: [],
        experience: [],
        image: ""
    })

    // edit Textfields variables
    const [editName, setEditName] = useState(teacher.name) // string
    const [editContact, setEditContact] = useState(teacher.contact) // string
    const [editAddress, setEditAddress] = useState(teacher.address) // string

    // edit dialog box variable
    const [editDialog, setEditDialog] = useState(false); // set to true when edit profile button is clicked

    const handleEditDialogClose = () => {
        setEditDialog(false);
    }


    //Check whether the teacher has logged in
    //If Yes, then get her details
    //If No, Show error and navigate to Login Page
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
            console.log(res)
            setTeacher(res.data.user)
        }
        catch (err) {
            console.log(err)
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

    // Check Login on every page refresh
    useEffect(() => {
        checkLogin()
    }, [])


    // Update the edited profile in backend on clicking submit button
    const handleEdit = () => {

        setEditDialog(false)

        axios.post("http://localhost:4000/teacher/updateProfile", {
            email: teacher.email,
            name: editName,
            contact: editContact,
            address: editAddress
        })
            .then(res => {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated Successfully',
                    allowOutsideClick: false,
                })
                    .then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload()
                        }
                    })
            })
            .catch(err => {
                Swal.fire({
                    icon: 'error',
                    title: 'Could not update Profile, Please try again later.'
                })
            })
    }

    // if cancel button is pressed in edit dialog box
    const handleCancel = () => {
        setEditDialog(false)
        setEditName(teacher.name)
        setEditContact(teacher.contact)
        setEditAddress(teacher.address)
    }


    useEffect(() => {
        setEditName(teacher.name)
        setEditContact(teacher.contact)
        setEditAddress(teacher.address)
    }, [teacher])


    return (
        <div>
            <Container maxWidth="false" sx={{ "padding": "2%", "width": "90%" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={4} >
                        <Box style={container}>
                            <Box sx={imgstyle} component="img" src={teacher.image}>
                            </Box>
                            <Typography component="div" align="left" sx={{ "margin": "2%" }}>
                                <Typography
                                    variant="h4"
                                    sx={{ "marginTop": "8%" }}
                                >
                                    {teacher.name}
                                </Typography>
                                <br />
                                <br />
                                <br />
                                <Typography
                                    variant="h6"
                                    fontWeight="regular"
                                >
                                    Age: {getAge(teacher.dob)}
                                    <br></br>
                                    Contact Number: {teacher.contact}
                                    <br></br>
                                    Address: {teacher.address}
                                </Typography>
                            </Typography>

                            {/* Edit Profile Button */}

                            <Button
                                variant="contained"
                                fullWidth
                                type="editProfile"
                                onClick={() => { setEditDialog(true) }}
                                sx={{
                                    backgroundImage: 'linear-gradient(to right, #FF9F4A, #FF3C83);',
                                    '&:hover': {
                                        backgroundImage: 'linear-gradient(to left, #FF9F4A, #FF3C83)'
                                    }
                                }}
                            >
                                Edit Profile
                            </Button>
                            {/* Edit Dialog Box */}
                            <Dialog
                                sx={{
                                    "padding": "2%",
                                    position: 'absolute',
                                    left: "0px",
                                    top: "0px",
                                    right: "0px",
                                    bottom: "0px",
                                    margin: "auto",
                                    width: "100%",
                                    height: "100%"
                                }}
                                open={editDialog}
                                onClose={handleEditDialogClose}
                            >
                                <DialogContent>
                                    <Typography
                                        variant="h4"
                                        align="center"
                                        marginBottom="5%"
                                    >
                                        Edit Profile
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={3}>
                                            <Typography
                                                variant="h5"
                                                align="left"
                                            >
                                                Name :
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={9}>
                                            <TextField
                                                value={editName}
                                                onChange={(event) => { setEditName(event.target.value) }}
                                            ></TextField>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Typography
                                                variant="h5"
                                                align="left"
                                            >
                                                Contact No :
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={9}>
                                            <TextField
                                                value={editContact}
                                                onChange={(event) => { setEditContact(event.target.value) }}
                                            ></TextField>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Typography
                                                variant="h5"
                                                align="left"
                                            >
                                                Address:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={9}>
                                            <TextField
                                                multiline
                                                maxRows={4}
                                                value={editAddress}
                                                onChange={(event) => { setEditAddress(event.target.value) }}
                                            ></TextField>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                sx={{
                                                    "background": "red",
                                                    "&:hover": {
                                                        "background": "red"
                                                    }
                                                }}
                                                onClick={handleCancel}
                                            >
                                                Cancel
                                            </Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            {/* On Clicking the submit button in edit dialog */}
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                onClick={handleEdit}
                                            >
                                                Submit
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </DialogContent>
                            </Dialog>
                        </Box>
                        <br></br>
                        <Box style={container}>
                            <Typography
                                variant="h4"
                                color="primary"
                                align="left"
                                sx={{
                                    "margin": "2%",
                                }}

                            >
                                Qualifications:
                            </Typography>
                            <Typography
                                variant="body1"
                                color="textSecondary"
                                align="left"
                                component="div"
                            >
                                <ul>
                                    {teacher.qualification.map(q => {
                                        return (<li key={q}>{q}</li>)
                                    })}
                                </ul>
                            </Typography>
                            <Typography
                                variant="h4"
                                color="primary"
                                align="left"
                                sx={{
                                    "margin": "2%"
                                }}
                            >
                                Experience:
                            </Typography>
                            <Typography
                                align="left"
                                variant="body1"
                                color="textSecondary"
                                component="div"
                            >
                                <ul>
                                    {teacher.experience.map(e => {
                                        return (<li key={e}>{e}</li>)
                                    })}
                                </ul>
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} rowSpacing={2}>
                        <Box>
                            <Box style={container}>
                                <Grid container sx={{ "padding": "2%" }}>
                                    <Grid item xs={12} sm={12} md={8}>
                                        <Typography
                                            variant="h3"
                                            align="left"
                                            fontWeight="light"
                                            gutterBottom
                                        >
                                            {current.getDate()}th {monthNames[current.getMonth()]}, {current.getFullYear()}
                                            <br></br>
                                            {dayNames[current.getDay()]}
                                        </Typography>
                                        <Typography
                                            variant="h3"
                                            color="primary"
                                            align="left"
                                            gutterBottom
                                            margin="1%"
                                        >
                                            Welcome <br></br>
                                            {teacher.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Calendar />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography
                                            variant="h6"
                                            color="secondary"
                                            align="left"
                                            fontWeight="light"
                                            fontSize="24px"
                                            gutterBottom
                                        >
                                            Quote of the Day:
                                            <Typography
                                                variant="body1"
                                                color="black"

                                            >
                                                A positive atmosphere nurtures a positive attitude, which is required to take positive action.
                                                <br></br>
                                                &emsp; <i>- Richard M Devos</i>
                                            </Typography>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                        <br />
                        <Box
                            style={container}
                        >
                            <Typography
                                variant="h3"
                                color="primary"
                                align="left"
                            >
                                Today's Classes:
                            </Typography>
                            <Table stickyHeader >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Class</TableCell>
                                        <TableCell>Start Time</TableCell>
                                        <TableCell>End Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {teacher.classes.map(cl => {
                                        return (
                                            <TableRow key={cl.classname}>
                                                <TableCell key={cl.classname}>{cl.classname}</TableCell>
                                                <TableCell key={cl.starttime}>{cl.starttime}</TableCell>
                                                <TableCell key={cl.endtime}>{cl.endtime}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default Dashboard