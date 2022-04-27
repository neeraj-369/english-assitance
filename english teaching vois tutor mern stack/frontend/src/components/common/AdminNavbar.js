import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Link } from 'react-router-dom';
import { useState } from "react";
import Menu from "@mui/icons-material/Menu";
import { useLocation } from "react-router-dom";
import { AppBar, Drawer, IconButton, ListItem, ListItemIcon, Toolbar, Typography } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { List } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ListItemButton } from "@mui/material";
import logo from '../../assets/images/teacher.png'
import { Grid } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
// import { Tab } from "@mui/material";
// import { Tabs } from "@mui/material";



const AdminNavbar = (props) => {

    const { SubMenu } = Menu;
    const location = useLocation();
    const [state, setState] = useState({})
    const routes = ["/register/teacher", "/register/student", "/register/sentence", "/"]
    const theme = useTheme();
    const [value, setValue] = useState('2')
    const isMatch = useMediaQuery(theme.breakpoints.down("md"));
    const [drawer, setDrawer] = useState(false);


    const GetPageName = () => {
        if (location.pathname.split('/')[1] == routes[0]) {
            return "Dashboard"
        }
        else if (location.pathname.split('/')[1] == routes[1]) {
            return "Teacher"
        }
        else if(location.pathname.split('/')[1] == routes[2]) {
            return "Student"
        }
    }

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    }));

    const navigate = useNavigate();
    const handleDrawerOpen = () => {
        setDrawer(true);
    };

    const handleDrawerClose = () => {
        setDrawer(false);
    };
    return (
        <div style={{ "marginBottom": "1%" }}>
            <AppBar
                position="static"
                sx={{
                    "background": "white"
                }}
            >
                <Toolbar
                    
                >
                    {isMatch ? <>
                        <IconButton
                            onClick={(e) => { setDrawer(true) }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            
                        >
                            {GetPageName()}
                        </Typography>
                        <Drawer
                            anchor="right"
                            open={drawer}
                            onClose={(e) => { setDrawer(false) }}
                        >
                            <DrawerHeader align="right">
                                <IconButton onClick={handleDrawerClose}>
                                    {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                                </IconButton>
                            </DrawerHeader>
                            <Divider />
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <DashboardIcon />
                                        <ListItemButton onClick={() => { setDrawer(false); navigate("/dashboard") }}>
                                            Dashboard
                                        </ListItemButton>
                                    </ListItemIcon>
                                </ListItem>
                                <Divider />
                                <ListItemButton onClick={() => { setDrawer(false); navigate("/studentreports")}}>
                                    Teacher
                                </ListItemButton>
                                <Divider />
                                <ListItemButton onClick={() => { setDrawer(false); navigate("/classoverview")}}>
                                    Student
                                </ListItemButton>
                                <Divider />
                                <ListItemButton onClick={() => { setDrawer(false); navigate("/")}}>
                                    Logout
                                </ListItemButton>
                                <Divider />
                            </List>
                        </Drawer>

                    </> :
                        <>
                            <img src={logo} style={{ "height": "45px", "width": "45px" }}></img>
                            <Tabs value={'/register/' + location.pathname.split('/')[3]} textColor="secondary" indicatorColor="secondary" variant="scrollable" scrollButtons allowScrollButtonsMobile aria-label="scrollable force tabs example">
                                <Tab label="Teacher" value={routes[0]} component={Link} to={routes[0]} />
                                <Tab label="Student" value={routes[1]} component={Link} to={routes[1]} />
                                <Tab label="Sentence" value={routes[2]} component={Link} to={routes[2]} />
                                <Tab label="Logout" value={routes[3]} component={Link} to={routes[3]} />
                            </Tabs>
                        </>
                    }
                </Toolbar>

            </AppBar>
        </div>
    );
};

export default AdminNavbar;
