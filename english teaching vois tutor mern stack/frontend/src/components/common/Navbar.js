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
import DashboardIcon from '@mui/icons-material/Dashboard';
import QuizIcon from '@mui/icons-material/Quiz';
import SchoolIcon from '@mui/icons-material/School';
import SummarizeIcon from '@mui/icons-material/Summarize';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import LogoutIcon from '@mui/icons-material/Logout';



const Navbar = (props) => {

    const { SubMenu } = Menu;
    const location = useLocation();
    const [state, setState] = useState({})
    const routes = ["/teacher/dashboard", "/teacher/studentreports", "/teacher/classoverview", "/teacher/teachingview", "/teacher/assessmentview", "/logout"]
    const theme = useTheme();
    const [value, setValue] = useState('2')
    const isMatch = useMediaQuery(theme.breakpoints.down("md"));
    const [drawer, setDrawer] = useState(false);


    const GetPageName = () => {
        if (location.pathname.split('/')[2] == 'dashboard') {
            return "Dashboard"
        }
        else if (location.pathname.split('/')[2] == 'studentreports') {
            return "Student Reports"
        }
        else if (location.pathname.split('/')[2] == 'classoverview') {
            return "Class Overview"
        }
        else if (location.pathname.split('/')[2] == 'teachingview') {
            return "Teaching View"
        }
        else if (location.pathname.split('/')[2] == "assessmentview") {
            return "Assessment View"
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
        <div style={{ marginBottom: "70px" }}>
            <AppBar
                sx={{
                    background: "white",
                    position: "fixed",
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
                        <Box
                            component="img"
                            src={logo}
                            height="25px"
                            width="25px"
                            margin="2%"
                            marginRight="3%"
                        ></Box>
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
                                <ListItem>
                                    <ListItemIcon>
                                        <SummarizeIcon />
                                        <ListItemButton onClick={() => { setDrawer(false); navigate("/studentreports") }}>
                                            Students Reports
                                        </ListItemButton>
                                    </ListItemIcon>
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemIcon>
                                        <InsertChartIcon />
                                        <ListItemButton onClick={() => { setDrawer(false); navigate("/classoverview") }}>
                                            Class overview
                                        </ListItemButton>
                                    </ListItemIcon>
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemIcon>
                                        <SchoolIcon />
                                        <ListItemButton onClick={() => { setDrawer(false); navigate("/teachingview") }}>
                                            Teaching view
                                        </ListItemButton>
                                    </ListItemIcon>
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemIcon>
                                        <QuizIcon />
                                        <ListItemButton onClick={() => { setDrawer(false); navigate("/assessmentview") }}>
                                            Assessment view
                                        </ListItemButton>
                                    </ListItemIcon>
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemIcon>
                                        <LogoutIcon />
                                        <ListItemButton onClick={() => { setDrawer(false); navigate("/") }}>
                                            Logout
                                        </ListItemButton>
                                    </ListItemIcon>
                                </ListItem>
                                <Divider />
                            </List>
                        </Drawer>
                    </> :
                        <>
                            <img src={logo} style={{ "height": "45px", "width": "45px" }}></img>
                            <Tabs value={'/teacher/' + location.pathname.split('/')[2]} textColor="secondary" indicatorColor="secondary" variant="scrollable" scrollButtons allowScrollButtonsMobile aria-label="scrollable force tabs example">
                                <Tab label="Dashboard" value={routes[0]} component={Link} to={routes[0]} />
                                <Tab label="Student reports" value={routes[1]} component={Link} to={routes[1]} />
                                <Tab label="Class Overview" value={routes[2]} component={Link} to={routes[2]} />
                                <Tab label="Teaching view" value={routes[3]} component={Link} to={routes[3]} />
                                <Tab label="Assessment view" value={routes[4]} component={Link} to={routes[4]} />
                                <Tab label="Log out" value={routes[5]} component={Link} to={routes[5]} />
                            </Tabs>
                        </>
                    }
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Navbar;
