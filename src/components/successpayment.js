import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { loading$, loadingpayment$ } from "../redux/action";
import { makeStyles, Container, Box, Typography } from "@material-ui/core";
import firebase, { firestore, auth } from "../config";
import { ajax } from "rxjs/ajax";
import { async } from "rxjs/internal/scheduler/async";
import { navigate } from "@reach/router";
const { Converter } = require("easy-currencies");

let converter = new Converter(
  "OpenExchangeRates",
  "67eb8de24a554b9499d1d1bf919c93a3"
);

const useStyles = makeStyles((theme) => ({
  margintop: {
    marginTop: theme.spacing(2),
  },
}));

const storageData = JSON.parse(window.localStorage.getItem("userdata"));
const paymentInfo = JSON.parse(window.localStorage.getItem("paymentInfo"));

function PaymentSuccess() {
  const classes = useStyles();
  const currentUserId = storageData.id;
  const currencySymbol = JSON.parse(window.localStorage.getItem("country"))
    .currencycode;
  const blockindex = paymentInfo.blockindex;
  const depositamount = parseInt(paymentInfo.amount);
  const referrerpercent = (4 / 100) * depositamount;
  const referrerpercentage = converter.convert(
    referrerpercent,
    currencySymbol,
    "USD"
  );
  const dispatch = useDispatch();
  const [valid, setValid] = useState(true);
  const isLoading = useSelector((state) => state.loadingpayment);
  const { setIntro } = useContext(AppContext);
  const [userInfo, setUserInfo] = useState({
    name: "",
    id: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    auth.onAuthStateChanged((user) => {
      setUserInfo({ ...userInfo, name: user.displayName, id: user.uid });
    });

    if (isLoading.loading) {
      const startLoadingSucess = async () => {
        await dispatch(loading$());
      };

      startLoadingSucess().then(() => {
        firestore
          .doc(`users/${currentUserId}`)
          .collection("deposits")
          .add({
            block_name: paymentInfo.block.name,
            deposit_amount: depositamount,
            amount: depositamount,
            userid: currentUserId,
            complete: false,
            date: new Date().toLocaleDateString(),
            created_at: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then((tr) => {
            console.log("transaction added");
            const depositid = tr.id;
            ajax({
              url: "https://hotblockexpressapi.herokuapp.com/ipn",
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: {
                blockindex: blockindex,
                deposit_amount: depositamount,
                userid: currentUserId,
                depositid: depositid,
                duration: paymentInfo.block.duration,
                currency: currencySymbol,
              },
            }).subscribe(() => {
              console.log("started cron");
              dispatch(loadingpayment$());
              const referrer = storageData.referrer;
              const referrerId = storageData.referrerid;
              if (referrer) {
                //add referrer bonus is true
                firestore
                  .doc(`users/${referrerId}`)
                  .collection("bonus")
                  .add({
                    amount: referrerpercentage,
                    deposit_amount: referrerpercentage,
                    from: storageData.firstName,
                    date: new Date().toLocaleDateString(),
                  })
                  .then(() => {
                    //add notification to referrer database
                    console.log(`referral percentage: ${referrerpercentage}`);
                    firestore
                      .doc(`users/${referrerId}`)
                      .collection("notification")
                      .add({
                        date: new Date().toLocaleDateString(),
                        time: new Date().toLocaleTimeString(),
                        amount: referrerpercentage,
                        type: "Bonus",
                      });
                  })
                  .then(() => {
                    console.log("transactions complete");
                    navigate("complete");
                  });
              } else {
                dispatch(loading$());
                navigate("complete");
              }
            });
          });
      });
    } else {
      setValid(!valid);
    }
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" m={5}>
        {valid ? (
          <Typography variant="body1">ok good</Typography>
        ) : (
          <Typography variant="body1" color="error">
            error transaction
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default PaymentSuccess;
