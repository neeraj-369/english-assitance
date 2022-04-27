import { Container, Grid, Box, Typography, Button, TableHead, TableRow, TableBody, TableCell, Table } from '@mui/material';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import 'react-calendar/dist/Calendar.css';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { container, headingbutton } from '../../css/cssfiles'

const StudentReports = () => {
   
    const navigate = useNavigate();
    const [cls, setCls] = useState("6B")
    const [students, setStudents] = useState([])

    useEffect(() => {
        axios.post("http://localhost:4000/student/", { cls: cls })
            .then((res) => {
                setStudents(res.data.students)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    const checkLogin = async () => {

        try {
            const res = await axios.get("http://localhost:4000/login/isUserAuth", {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            })
        }
        catch (err) {
            navigate('/');
            alert(err.response.data.message);
        }

    }

    const handleClick = (rollno) => {

        localStorage.setItem("Class", cls);
        localStorage.setItem("RollNo", rollno);

    }

    useEffect(() => {
        checkLogin()
    }, [])

    return (
        <div>
            <Button>
                <Typography
                    style={headingbutton}
                    variant="h3"
                    p={2}
                >
                    Class 6 B
                </Typography>
            </Button>
            <Container maxWidth="xl">
                <Grid container>
                    <Grid item xs={12} >
                        <Box sx={container} style={{ overflow: 'auto' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell> Roll No</TableCell>
                                        <TableCell> Name </TableCell>
                                        <TableCell>Current Chapter</TableCell>
                                        <TableCell>Progress</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        students.map(stu => {
                                            return (
                                                <TableRow>
                                            
                                                    <TableCell style={{fontSize: "1.3em"}}>{stu.rollno}</TableCell>
                                                    <TableCell style={{fontSize: "1.3em"}} component={Link} to={'detailedreport'} onClick={() => {handleClick(stu.rollno)}}>{stu.name}</TableCell>
                                                    <TableCell style={{fontSize: "1.3em"}}>{stu.classChapter}</TableCell>
                                                    <TableCell style={{fontSize: "1.3em"}}>{stu.progress}</TableCell>
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

export default StudentReports