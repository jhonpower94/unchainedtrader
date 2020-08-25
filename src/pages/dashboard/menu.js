import React, { useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import NotificationsSharpIcon from "@material-ui/icons/NotificationsSharp";
import Badge from "@material-ui/core/Badge";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Fade from "@material-ui/core/Fade";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange, orange } from "@material-ui/core/colors";
import { Button, Link } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { useSelector } from "react-redux";
import { app } from "../../config";
import { navigate } from "@reach/router";

const useStyles = makeStyles((theme) => ({
  sectionDesktop: {
    display: "flex",
  },
  orange: {
    color: theme.palette.getContrastText(orange[800]),
    backgroundColor: theme.palette.primary.main,
  },
  space: {
    marginTop: theme.spacing(1),
  },
  flexcolumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    marginTop: theme.spacing(2),
  },
}));
const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

function DasboardMenu() {
  const classes = useStyles();
  const currentStrings = useSelector((state) => state.language);
  const notifications = useSelector((state) => state.notification.notification);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickUser = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElUser(null);
  };

  function logOut() {
    app
      .auth()
      .signOut()
      .then(function () {
        navigate("../account");
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function navigaTion() {
    navigate("../account/resetpassword");
  }

  useEffect(() => {}, []);

  const selectNoty = (type) => {
    console.log(type);
  };

  return (
    <div className={classes.sectionDesktop}>
      <Button onClick={handleClick} color="primary">
        <Badge variant="dot" color="primary">
          <NotificationsSharpIcon color="action" />
        </Badge>
      </Button>

      <IconButton edge="end" color="primary" onClick={handleClickUser}>
        <Avatar className={classes.orange}>J</Avatar>
      </IconButton>

      <StyledMenu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {notifications.map((lnk, index) => (
          <Fade in={open} key={index} style={{ transitionDelay: lnk.duration }}>
            <MenuItem onClick={handleClose} className={classes.flexcolumn}>
              <Typography variant="subtitle2">
                {new Date().toLocaleDateString()}
              </Typography>
              <Typography variant="body1" className={classes.space}>
                &#128176; {lnk.type}
              </Typography>
              <Typography variant="subtitle2">
                {lnk.type === "investment"
                  ? `Investment return of ${lnk.amount} @${lnk.date}`
                  : `you have recieves a bonus of from a user`}
                <Link
                  component="button"
                  onClick={() => {
                    selectNoty(lnk.type);
                  }}
                >
                  check out
                </Link>
              </Typography>
            </MenuItem>
          </Fade>
        ))}
      </StyledMenu>

      <StyledMenu
        id="customized-menu"
        anchorEl={anchorElUser}
        keepMounted
        open={Boolean(anchorElUser)}
        onClose={handleClose}
      >
        <Fade in={Boolean(anchorElUser)} style={{ transitionDelay: "100ms" }}>
          <MenuItem>
            <ListItemText primary="Jhon snow" secondary="jhon@gmail.com" />
          </MenuItem>
        </Fade>

        <Divider />
        {[
          {
            title: "Reset password",
            action: navigaTion,
          },
          { title: currentStrings.usermenu.logout, action: logOut },
        ].map((link, index) => (
          <Fade
            in={Boolean(anchorElUser)}
            key={index}
            style={{ transitionDelay: index * 200 }}
          >
            <MenuItem onClick={link.action}>
              <ListItemText primary={link.title} />
            </MenuItem>
          </Fade>
        ))}
      </StyledMenu>
    </div>
  );
}

export default DasboardMenu;