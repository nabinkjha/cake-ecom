import React from 'react';

import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Link,
  createTheme,
  ThemeProvider,
  CssBaseline,
  IconButton,
  ListItemText,
  ListItem,
  Divider,
  List,
  Drawer,
  InputBase,
  Switch,
} from "@mui/material";
import Copyright from "./Copyright";
import ThemeReducer from "./ThemeReducer";
import useStyles from "../utils/style";
import NextLink from "next/link";
import { Box } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import CancelIcon from '@mui/icons-material/Cancel';

import Head from 'next/head';

export default function Layout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: JSX.Element;
}) {
  const[darkMode, setDarkMode]=useState<boolean>(false);
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: "1.6rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
      h2: {
        fontSize: "1.4rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
    },
    palette: {
      mode:  darkMode ? 'dark' : 'light', 
      primary: {
        main: "#f0c000",
      },
      secondary: {
        main: "#208080",
      },
    },
  });
  const classes = useStyles();

  const [sidbarVisible, setSidebarVisible] = useState<boolean|null>(false);
  
  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const pagetitle = "Jha's Home Bakery";
  return (
    <div>
      <Head>
        <title>{title ? `${title} - ${pagetitle}` : pagetitle}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" className={classes.navbar}>
          <Toolbar className={classes.toolbar}>
            <Box display="flex" alignItems="center">
              <IconButton
                edge="start"
                aria-label="open drawer"
                onClick={sidebarOpenHandler}
                className={classes.menuButton}
              >
                <MenuIcon className={classes.navbarButton} />
              </IconButton>
              <NextLink href="/" passHref>
                <Link>
                  <Typography className={classes.brand}>{pagetitle}</Typography>
                </Link>
              </NextLink>
            </Box>
            <Drawer
              anchor="left"
              open={sidbarVisible}
              onClose={sidebarCloseHandler}
            >
              <List>
                <ListItem>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography>Shopping by category</Typography>
                    <IconButton
                      aria-label="close"
                      onClick={sidebarCloseHandler}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              </List>
            </Drawer>

            <div>
              <ThemeReducer onChange={(value:boolean)=> setDarkMode(value)}/>
              <NextLink href="/cart" passHref>
                <Link>
                  <Typography component="span">
                  Cart
                  </Typography>
                </Link>
              </NextLink>
              <NextLink href="/login" passHref>
                  <Link>
                    <Typography component="span">Login</Typography>
                  </Link>
                </NextLink>
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <Copyright />
        </footer>
      </ThemeProvider>
    </div>
  );
}
