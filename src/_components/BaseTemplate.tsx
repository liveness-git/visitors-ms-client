import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useRouteMatch } from 'react-router-dom';
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
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Collapse from '@material-ui/core/Collapse';
import { ListItemText, Menu, MenuItem, Tooltip } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import EditIcon from '@material-ui/icons/Edit';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import PeopleIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/Settings';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import RefreshIcon from '@material-ui/icons/Refresh';

import { get } from '_utils/Http';
import { getUserInfo, removeSessionStrage, saveUserInfo, setReloadStateFlg } from '_utils/SessionStrage';

import { Copyright } from './Copyright';
import { MySnackberProvider } from './MySnackbarContext';
import { MyLocation } from '_components/MyLocation';

import { User } from '_models/User';
import { LocationParams } from '_models/Location';

const useStyles = makeStyles((theme) => {
  const drawerWidth = 230;

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
    menuButton: {
      marginRight: 36,
    },
    menuButtonHidden: {
      display: 'none',
    },
    title: {
      flexGrow: 1,
    },
    location: {
      color: 'white',
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
      // color: theme.palette.text.secondary,
      color: 'rgba(0, 0, 0, 0.87)',
    },
    nested: {
      // paddingLeft: theme.spacing(4),
      paddingLeft: theme.spacing(10),
    },
  });
});

type UserStorageState = { signedIn: boolean } & User;
type UserStorageAction = { type: 'signedIn'; user: User } | { type: 'signedOut' };

type BaseTemplateProps = {
  children: React.ReactNode;
  adminMode?: true;
  frontMode?: true;
  menuOpen?: true;
};

const BaseTemplate = ({ children, adminMode, frontMode, menuOpen }: BaseTemplateProps) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const match = useRouteMatch<LocationParams>();

  // 左メニューエリアの開閉
  const [open, setOpen] = useState(menuOpen ? true : false);

  // 左メニュー：設定の詳細開閉
  const [settingsOpen, setSettingsOpen] = useState(true);

  useEffect(() => {
    if (!open) {
      setSettingsOpen(false);
    }
  }, [open]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleSettingsClick = () => {
    if (!open) {
      setOpen(true);
    }
    setSettingsOpen(!settingsOpen);
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

  // ログアウトアクション
  const handleSignOut = async () => {
    try {
      const result = await get<string | undefined>('/oauth/signout');
      if (result.ok) {
        removeSessionStrage(); //sessionStrageから情報を削除
        window.location.href = '/login';
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ストレージの状態初期値
  const initialState: UserStorageState = {
    signedIn: false,
    email: '',
    name: '',
    isAdmin: false,
    isFront: false,
  };
  // ストレージの状態設定
  const userStorageReducer = (state: UserStorageState, action: UserStorageAction) => {
    switch (action.type) {
      case 'signedIn':
        return { signedIn: true, email: action.user.email, name: action.user.name, isAdmin: action.user.isAdmin, isFront: action.user.isFront };
      case 'signedOut':
        return initialState;
      default:
        return state;
    }
  };
  // ストレージの状態管理
  const [userStorage, dispatch] = useReducer(userStorageReducer, initialState);

  // MS認証状態の確認
  const checkAuth = useCallback(async () => {
    try {
      const data = getUserInfo(); //sessionStrageからUser情報を取得
      if (data) {
        // sessionStrageから復元
        const user = JSON.parse(data) as User;
        dispatch({ type: 'signedIn', user: user });
      } else {
        // サーバーのセッションにユーザー情報が登録されているか確認
        const result = await get<User>('/user/me');
        if (result.parsedBody) {
          const user = result.parsedBody;
          saveUserInfo(JSON.stringify(user)); //sessionStrageにUser情報を格納
          dispatch({ type: 'signedIn', user: user });
        } else {
          removeSessionStrage();
          dispatch({ type: 'signedOut' });
          console.log('Failed to retrieve email');
        }
      }
    } catch (error) {
      // serverのpoliciesで弾かれた場合、ここへ遷移
      removeSessionStrage();
      window.location.href = '/login';
    }
  }, []);

  // 画面リフレッシュ
  const refreshPage = () => {
    setReloadStateFlg(); // リフレッシュ後にstateを復元できるようフラグをONにする
    window.location.reload();
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 権限制御をつけてchildrenを表示する
  let conditionalChildren = children;
  const error = <>{t('common.msg.authority-error')}</>;
  if (adminMode && !userStorage.isAdmin) {
    conditionalChildren = error; // 管理者Roleエラー
  }
  if (frontMode && !userStorage.isFront) {
    conditionalChildren = error; // フロントRoleエラー
  }

  if (!userStorage.signedIn) {
    return <></>;
  }

  return (
    <MySnackberProvider>
      <div className={classes.root}>
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              Visitors for Microsoft
            </Typography>
            <div>
              <MyLocation></MyLocation>
            </div>
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
                <MenuItem onClick={handleMenuClose}>{userStorage.email}</MenuItem>
                <MenuItem onClick={handleSignOut}>{t('main.menu.logout')}</MenuItem>
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
            <Link to={`/${match.params.location}/main`} className={classes.link}>
              <ListItem button>
                <Tooltip title={t('main.menu.created-visit-info') as string}>
                  <ListItemIcon>
                    <EditIcon />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText primary={t('main.menu.created-visit-info')} />
              </ListItem>
            </Link>
            <Link to={`/${match.params.location}/main/byroom`} className={classes.link}>
              <ListItem button>
                <Tooltip title={t('main.menu.by-meeting-room') as string}>
                  <ListItemIcon>
                    <MeetingRoomIcon />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText primary={t('main.menu.by-meeting-room')} />
              </ListItem>
            </Link>
            {userStorage.isFront && (
              <Link to={`/${match.params.location}/front`} className={classes.link}>
                <ListItem button>
                  <Tooltip title={t('main.menu.front') as string}>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText primary={t('main.menu.front')} />
                </ListItem>
              </Link>
            )}
            {userStorage.isAdmin && (
              <>
                <ListItem button onClick={handleSettingsClick}>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('main.menu.settings')} />
                  {settingsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
                  <Link to={`/${match.params.location}/settings/role`} className={classes.link}>
                    <ListItem button className={classes.nested}>
                      <ListItemText primary={t('main.menu.settings.role')} />
                    </ListItem>
                  </Link>
                  <Link to={`/${match.params.location}/settings/location`} className={classes.link}>
                    <ListItem button className={classes.nested}>
                      <ListItemText primary={t('main.menu.settings.location')} />
                    </ListItem>
                  </Link>
                  <Link to={`/${match.params.location}/settings/category`} className={classes.link}>
                    <ListItem button className={classes.nested}>
                      <ListItemText primary={t('main.menu.settings.category')} />
                    </ListItem>
                  </Link>
                  <Link to={`/${match.params.location}/settings/room`} className={classes.link}>
                    <ListItem button className={classes.nested}>
                      <ListItemText primary={t('main.menu.settings.room')} />
                    </ListItem>
                  </Link>
                </Collapse>
              </>
            )}
            <ListItem button onClick={refreshPage}>
              <Tooltip title={t('main.menu.refresh') as string}>
                <ListItemIcon>
                  <RefreshIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary={t('main.menu.refresh')} />
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            {/* <Typography component="h2" variant="h5" color="inherit" noWrap className={classes.pageTitle}>
              {title}
            </Typography> */}
            {conditionalChildren}
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
