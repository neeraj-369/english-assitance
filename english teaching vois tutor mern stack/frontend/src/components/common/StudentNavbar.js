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



const StudentNavbar = (props) => {

    const { SubMenu } = Menu;
    const location = useLocation();
    const [state, setState] = useState({})
    const routes = ["/student/dashboard", "/student/practice", "/student/test", "/"]
    const theme = useTheme();
    const [value, setValue] = useState('2')
    const isMatch = useMediaQuery(theme.breakpoints.down("md"));
    const [drawer, setDrawer] = useState(false);


    const GetPageName = () => {
        if ("/student/" + location.pathname.split('/')[2] == routes[0]) {
            return "Dashboard"
        }
        else if ("/student/" + location.pathname.split('/')[2] == routes[1]) {
            return "Practice Mode"
        }
        else if ("/student/" + location.pathname.split('/')[2] == routes[2]) {
            return "Test Mode"
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
        <div style={{ "marginBottom": "2em" }}>
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
                                        <ListItemButton onClick={() => { setDrawer(false); navigate(routes[0]) }}>
                                            Dashboard
                                        </ListItemButton>
                                    </ListItemIcon>
                                </ListItem>
                                <Divider />
                                <ListItemButton onClick={() => { setDrawer(false); navigate(routes[1]) }}>
                                    Practice
                                </ListItemButton>
                                <Divider />
                                <ListItemButton onClick={() => { setDrawer(false); navigate(routes[2]) }}>
                                    Test
                                </ListItemButton>
                                <Divider />
                                <ListItemButton onClick={() => { setDrawer(false); navigate(routes[3]) }}>
                                    Logout
                                </ListItemButton>
                                <Divider />
                            </List>
                        </Drawer>

                    </> :
                        <>
                            <img src={logo} style={{ "height": "45px", "width": "45px" }}></img>
                            <Tabs value={'/' + 'student/' + location.pathname.split('/')[2]} textColor="secondary" indicatorColor="secondary" variant="scrollable" scrollButtons allowScrollButtonsMobile aria-label="scrollable force tabs example">
                                <Tab label="Dashboard" value={routes[0]} component={Link} to={routes[0]} />
                                <Tab label="Practice" value={routes[1]} component={Link} to={routes[1]} />
                                <Tab label="Test" value={routes[2]} component={Link} to={routes[2]} />
                                <Tab label="Logout" value={routes[3]} component={Link} to={routes[3]} />
                            </Tabs>
                        </>
                    }
                </Toolbar>

            </AppBar>
            {/* <Box
                sx={{
                    display: 'flex',
                    flexDirection: { md: 'row' },
                    height: 50,
                    width: '100%',
                    maxHeight: { xs: 233, md: 198 },
                    boxShadow: 1,
                }}
            >
                <div style={{
                    position: 'relative',
                    top: '8%',
                    left: '0%'
                }}>
                    <Box
                        component="img"
                        sx={{
                            height: '45px',
                            width: '45px',
                            maxHeight: { xs: 10000, md: 10000 },
                            maxWidth: { xs: 10000, md: 10000 },
                            borderRadius: '3px',
                            m: 0.01,
                            alignItem: "center",

                        }}
                        alt="Logo"
                        src={logo}
                    >

                    </Box>
                </div>

                {isMatch ? <>

                    <Grid container>
                        <Grid item sm={11.3}>
                            <Box display="flex" justifyContent="flex-end">
                                <IconButton
                                    size="large"
                                    aria-label="display more actions"
                                    edge="end"
                                    color="inherit"
                                    onClick={(e) => { setDrawer(true) }}
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid> */}

            {/* <Grid>
                        <Grid item xs={12}>
                            <Typography
                                align='center'
                            >
                                Dashboard
                            </Typography>

                            <IconButton
                                size="large"
                                aria-label="display more actions"
                                color="inherit"
                                onClick={(e) => { setDrawer(true) }}
                            >
                                <MenuIcon />
                            </IconButton>

                        </Grid>
                    </Grid>
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
                                    <ListItemButton onClick={() => navigate("/dashboard")}>
                                        Dashboard
                                    </ListItemButton>
                                </ListItemIcon>
                            </ListItem>
                            <Divider />
                            <ListItemButton onClick={() => navigate("/studentreports")}>
                                Students Reports
                            </ListItemButton>
                            <Divider />
                            <ListItemButton onClick={() => navigate("/classoverview")}>
                                Class overview
                            </ListItemButton>
                            <Divider />
                            <ListItemButton onClick={() => navigate("/teachingview")}>
                                Teaching view
                            </ListItemButton>
                            <Divider />
                            <ListItemButton onClick={() => navigate("/assesmentview")}>
                                Assesment view
                            </ListItemButton>
                            <Divider />
                            <ListItemButton onClick={() => navigate("/")}>
                                Logout
                            </ListItemButton>
                            <Divider />
                        </List>
                    </Drawer>
                    <IconButton
                        onClick={(e) => { setDrawer(true) }}
                    >
                        <MenuIcon />
                    </IconButton>
                </> :
                    <>
                        <div style={{
                            position: 'relative',
                            top: '4%',
                            left: '0%'
                        }}>
                            <Tabs value={'/' + location.pathname.split('/')[1]} textColor="secondary" indicatorColor="secondary" variant="scrollable" scrollButtons allowScrollButtonsMobile aria-label="scrollable force tabs example">
                                <Tab label="Dashboard" value={routes[0]} component={Link} to={routes[0]} />
                                <Tab label="Student reports" value={routes[1]} component={Link} to={routes[1]} />
                                <Tab label="Class Overview" value={routes[2]} component={Link} to={routes[2]} />
                                <Tab label="Teaching view" value={routes[3]} component={Link} to={routes[3]} />
                                <Tab label="Assesment view" value={routes[4]} component={Link} to={routes[4]} />
                                <Tab label="Log out" value={routes[5]} component={Link} to={routes[5]} />
                            </Tabs>
                        </div>
                    </>
                }
            </Box> */}
        </div>
    );
};

export default StudentNavbar;
