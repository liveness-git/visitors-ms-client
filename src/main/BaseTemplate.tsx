import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import { Copyright } from '../_components/Copyright';
import MyCalendar from '../_components/MyCalendar';
import { MySnackberProvider } from '../_components/MySnackbarContext';
import { get } from '_utils/Http';
import { Menu, MenuItem } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';

// import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => {
  const drawerWidth = 315;

  return createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    toolbar: {
      paddingRight: 24,
    },
    title: {
      flexGrow: 1,
    },
    drawerPaper: {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      // [theme.breakpoints.up('sm')]: {
      //   width: theme.spacing(9),
      // },
    },
    drawerCloseIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...theme.mixins.toolbar,
    },
    calendarHidden: {
      display: 'none',
    },
    pageTitle: {
      marginBottom: theme.spacing(1),
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
    },
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.text.secondary,
    },
  });
});

type BaseTemplateProps = {
  children: React.ReactNode;
  title: string;
  currentDate: Date | null;
  calendarOnChange: (date: Date | null) => void;
};

const BaseTemplate = ({ children, title, currentDate, calendarOnChange }: BaseTemplateProps) => {
  // const { t } = useTranslation();
  const classes = useStyles();

  // 左メニューエリアの開閉
  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  // アカウントアイコンの制御
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const accountIconOpen = Boolean(anchorEl);
  const handleAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleSignOut = async () => {
    try {
      const result = await get<string | undefined>('/oauth/signout');
      if (result.ok) {
        window.location.href = '/signin';
      }
    } catch (error) {
      console.log(error);
    }
  };

  // MS認証の状態
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState('');

  // MS認証状態の確認
  const checkAuth = useCallback(async () => {
    try {
      // サーバーのセッションにユーザー情報が登録されているか確認
      const result = await get<string>('/user/email');
      if (result.parsedBody) {
        setSignedIn(true);
        setEmail(result.parsedBody);
      } else {
        // TODO: ここに遷移することってある？？？
        setSignedIn(false);
        console.log('Failed to retrieve email');
      }
    } catch (error) {
      // serverのpoliciesで弾かれた場合、ここへ遷移
      window.location.href = '/signin';
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!signedIn) {
    return <></>;
  }

  return (
    <MySnackberProvider>
      <div className={classes.root}>
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              Visitors for Microsoft
            </Typography>
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleAccountMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={accountIconOpen}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>{email}</MenuItem>
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.drawerCloseIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem button onClick={handleDrawerOpen} className={clsx(open && classes.calendarHidden)}>
              <ListItemIcon>
                <CalendarTodayIcon />
              </ListItemIcon>
            </ListItem>
            <ListItem className={clsx(!open && classes.calendarHidden)}>
              <MyCalendar date={currentDate} onChange={calendarOnChange} />
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Typography component="h2" variant="h5" color="inherit" noWrap className={classes.pageTitle}>
              {title}
            </Typography>
            {children}
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    </MySnackberProvider>
  );
};

export default BaseTemplate;
