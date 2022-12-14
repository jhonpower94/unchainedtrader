import React, { useContext, useEffect } from "react";
import "./component.css";
import { Strings } from "../lang/language";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TranslateSharpIcon from "@material-ui/icons/TranslateSharp";
import ExpandMoreSharpIcon from "@material-ui/icons/ExpandMoreSharp";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import ReactCountryFlag from "react-country-flag";
import Fade from "@material-ui/core/Fade";
import Grow from "@material-ui/core/Grow";
import { useDispatch, useSelector } from "react-redux";
import { language$ } from "../redux/action";
import { AppContext } from "../App";
import { IconButton } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  stackicon: {
    height: 38,
    width: 38,
    border: "1px solid #E0E3E7",
    borderRadius: 10,
    
    backgroundColor: theme.palette.background.default,
    marginLeft: 16
  },
  space: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  flag: {
    margin: theme.spacing(2),
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

function SelectLanguage() {
  const classes = useStyles();
  const currentStrings = useSelector((state) => state.language);
  const { setRightoleft, currentlanguage, setCurrentlanguage } =
    useContext(AppContext);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // right to left function
  function setRtl(lang) {
    switch (lang) {
      case "ar":
        return setRightoleft({ status: true });
      case "he":
        return setRightoleft({ status: true });
      case "fa":
        return setRightoleft({ status: true });
      default:
        return setRightoleft({ status: false });
    }
  }

  const setLanguage = (lang, country) => {
    Strings.setLanguage(lang);
    dispatch(language$(Strings));
    setRtl(lang); // set right to left fuction
    setCurrentlanguage(country);
    setAnchorEl(null);
  };

  useEffect(() => {}, []);

  return (
    <React.Fragment>
      <IconButton onClick={handleClick} className={classes.stackicon}>
        <TranslateSharpIcon />
      </IconButton>

      <StyledMenu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {[
          {
            countryname: "????????",
            languagecode: "ar",
          },
          {
            countryname: "Deutsche",
            languagecode: "nl",
          },
          {
            countryname: "English",
            languagecode: "en",
          },
          {
            countryname: "espa??ol",
            languagecode: "es",
          },
          {
            countryname: "fran??ais",
            languagecode: "fr",
          },
          {
            countryname: "Italia",
            languagecode: "it",
          },

          {
            countryname: "Portugu??s",
            languagecode: "pt",
          },
          {
            countryname: "????????????",
            languagecode: "ru",
          },
          /*       {
            countryname: "az??rbaycan",
            languagecode: "az",
          },
          {
            countryname: "??????????",
            languagecode: "be",
          },
          {
            countryname: "???????????????",
            languagecode: "bn",
          },
          {
            countryname: "??????????????????",
            languagecode: "bg",
          },
          {
            countryname: "catal??",
            languagecode: "ca",
          },
          {
            countryname: "??????",
            languagecode: "zh",
          },
          
          {
            countryname: "hrvatski",
            languagecode: "hr",
          },
          {
            countryname: "??e??tina",
            languagecode: "cs",
          },
          {
            countryname: "Deutsche",
            languagecode: "de",
          },
         
          
          {
            countryname: "fran??ais",
            languagecode: "fr",
          },
          {
            countryname: "??????????????",
            languagecode: "he",
          },
          {
            countryname: "???????????????",
            languagecode: "hi",
          },
          {
            countryname: "Magyar",
            languagecode: "hu",
          },
          {
            countryname: "bahasa Indonesia",
            languagecode: "id",
          },
          {
            countryname: "Italia",
            languagecode: "it",
          },
          {
            countryname: "?????????",
            languagecode: "ja",
          },
          {
            countryname: "????????????????????????",
            languagecode: "ka",
          },
          {
            countryname: "??????????",
            languagecode: "kk",
          },
          {
            countryname: "?????????",
            languagecode: "ko",
          },
          {
            countryname: "????????????????????",
            languagecode: "mk",
          },
          {
            countryname: "norsk",
            languagecode: "nn",
          },
          {
            countryname: "Bokm??l",
            languagecode: "nb",
          },
          {
            countryname: "??????????",
            languagecode: "fa",
          },
          {
            countryname: "Portugu??s",
            languagecode: "pt",
          },
          {
            countryname: "Polskie",
            languagecode: "pl",
          },
          {
            countryname: "Rom??n??",
            languagecode: "ro",
          },
          {
            countryname: "????????????",
            languagecode: "ru",
          },
          {
            countryname: "????????????",
            languagecode: "sr",
          },
          {
            countryname: "svenska",
            languagecode: "sv",
          },
          {
            countryname: "?????????",
            languagecode: "th",
          },
          {
            countryname: "T??rk",
            languagecode: "tr",
          },
          {
            countryname: "??????????????????????",
            languagecode: "uk",
          },
          {
            countryname: "o'zbekcha",
            languagecode: "uz",
          },

          */
        ].map((lnk, index) => (
          <Fade
            in={open}
            key={index}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <MenuItem
              onClick={() => setLanguage(lnk.languagecode, lnk.countryname)}
            >
              <Typography className={classes.flag}>
                {lnk.countryname}
              </Typography>
            </MenuItem>
          </Fade>
        ))}
      </StyledMenu>
    </React.Fragment>
  );
}

export default SelectLanguage;

/*

<ReactCountryFlag
                countryCode={lnk.countrycode}
                svg
                style={{
                  width: "2em",
                  height: "2em",
                }}
                title={lnk.title}
              />
<Button
          color="inherit"
          variant={
            useMediaQuery(useTheme().breakpoints.up("sm")) ? "outlined" : "text"
          }
          className={classes.button}
          onClick={handleClick}
        >
          <TranslateSharpIcon />

          {useMediaQuery(useTheme().breakpoints.up("sm")) ? (
            <Typography className={classes.space}>
              {currentStrings.language}
            </Typography>
          ) : null}

          <ExpandMoreSharpIcon className={open ? "rotate" : ""} />
        </Button> */
