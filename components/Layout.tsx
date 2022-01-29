import React, { useEffect } from 'react';

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
  Menu,
  Button,
  MenuItem,
  Badge,
} from "@mui/material";
import Copyright from "./Copyright";
import useStyles from "../utils/style";
import NextLink from "next/link";
import { Box } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import Head from 'next/head';
import { useCart } from './cart/hooks/useCart';
import Cookies from "js-cookie";
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { getError } from '@/utils/error';

export default function Layout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: JSX.Element;
}) {
  const classes = useStyles();
  const router = useRouter();
  const { cartState, cartDispatch } = useCart();
  const { cart, userInfo ,darkMode} = cartState;
  const [sidbarVisible, setSidebarVisible] = useState<boolean|null>(false);
  const [darkModeStatus, setDarkModeStatus] = useState<boolean|null>(darkMode === 'ON');

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
      mode:  darkMode  === 'ON' ? 'dark' : 'light', 
      primary: {
        main: "#f0c000",
      },
      secondary: {
        main: "#208080",
      },
    },
  });
  const [categories, setCategories] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/product-category`);
      setCategories(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };
  const [query, setQuery] = useState('');
  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  
  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };
  const darkModeChangeHandler = () => {
    const dispatchType= darkMode === "ON" ? 'DARK_MODE_OFF' : 'DARK_MODE_ON';
    setDarkModeStatus(!darkModeStatus);
    cartDispatch({ type: dispatchType, payload: null });

  };

  const [anchorEl, setAnchorEl] = useState(null);
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const loginMenuCloseHandler = (e, redirect:string) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };
  const logoutClickHandler = () => {
    setAnchorEl(null);
    cartDispatch({ type: 'USER_LOGOUT',payload:null });
    router.push('/');
  };

  const pagetitle = "Jha's Home Bakery";
  return (
    <div>
    <Head>
      <title>{title ? title+ pagetitle :pagetitle}</title>
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
                <Typography className={classes.brand}>Jha's Home Bakery</Typography>
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
              <Divider light />
              {categories.map((category) => (
                <NextLink
                  key={category.id}
                  href={`/search?category=${category.id}`}
                  passHref
                >
                  <ListItem
                    button
                    component="a"
                    onClick={sidebarCloseHandler}
                  >
                    <ListItemText primary={category.name}></ListItemText>
                  </ListItem>
                </NextLink>
              ))}
            </List>
          </Drawer>

          <div className={classes.searchSection}>
            <form onSubmit={submitHandler} className={classes.searchForm}>
              <InputBase
                name="query"
                className={classes.searchInput}
                placeholder="Search products"
                onChange={queryChangeHandler}
              />
              <IconButton
                type="submit"
                className={classes.iconButton}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            </form>
          </div>
          <div>
            <Switch
              checked={darkModeStatus}
              onChange={darkModeChangeHandler}
            ></Switch>
            <NextLink href="/cart" passHref>
              <Link>
                <Typography component="span">
                  {cart.cartItems.length > 0 ? (
                    <Badge
                      color="secondary"
                      badgeContent={cart.cartItems.length}
                    >
                      Cart
                    </Badge>
                  ) : (
                    'Cart'
                  )}
                </Typography>
              </Link>
            </NextLink>
            {userInfo ? (
              <>
                <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={loginClickHandler}
                  className={classes.navbarButton}
                >
                  {userInfo.name}
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={loginMenuCloseHandler}
                >
                  <MenuItem
                    onClick={(e) => loginMenuCloseHandler(e, '/profile')}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={(e) =>
                      loginMenuCloseHandler(e, '/order-history')
                    }
                  >
                    Order Hisotry
                  </MenuItem>
                  {userInfo.isAdmin && (
                    <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e, '/admin/dashboard')
                      }
                    >
                      Admin Dashboard
                    </MenuItem>
                  )}
                  <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <NextLink href="/login" passHref>
                <Link>
                  <Typography component="span">Login</Typography>
                </Link>
              </NextLink>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Container className={classes.main}>{children}</Container>
    <Copyright />
    </ThemeProvider>
  </div>
  );
}
