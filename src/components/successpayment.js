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
const paymentInfostorage = JSON.parse(
  window.localStorage.getItem("paymentInfo")
);

function PaymentSuccess() {
  const classes = useStyles();
  const { paymentInfo } = useContext(AppContext);
  const userInfos = useSelector((state) => state.locationinfo.locationinfo);
  const txn_info = useSelector((state) => state.trxinfo);
  const currentUserId = userInfos.id;
  const currencySymbol = JSON.parse(window.localStorage.getItem("country"))
    .currencycode;
  const blockindex = txn_info.blockindex;
  const depositamount = parseInt(paymentInfo.amount);
  const referrerpercent = (5 / 100) * depositamount;

  const dispatch = useDispatch();
  const [valid, setValid] = useState(true);
  const isLoading = useSelector((state) => state.loadingpayment);
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
            block_name: txn_info.block.name,
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
                duration: parseInt(paymentInfo.block.duration),
                currency: currencySymbol,
                rate: parseInt(paymentInfo.block.rate),
              },
            }).subscribe(() => {
              console.log("started cron");

              dispatch(loadingpayment$());
              const referrer = userInfos.referrer;
              const referrerId = userInfos.referrerid;

              // add to all transaction
              firestore.collection("alldeposits").add({
                type: "investment",
                block_name: txn_info.block.name,
                deposit_amount: depositamount,
                amount: depositamount,
                userid: currentUserId,
                email: userInfos.email,
                firstname: userInfos.firstName,
                lastname: userInfos.lastName,
                date: new Date().toLocaleDateString(),
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
              });
              if (referrer) {
                //add referrer bonus is true
                firestore
                  .collection("users")
                  .doc(referrerId)
                  .collection("bonus")
                  .add({
                    amount: 5,
                    deposit_amount: 5,
                    from: `${userInfos.firstName} ${userInfos.lastName}`,
                    description: "Referral bonus",
                    date: new Date().toLocaleDateString(),
                    created_at: firebase.firestore.FieldValue.serverTimestamp(),
                  })
                  .then(() => {
                    //add notification to referrer database
                    console.log(`referral added`);
                    firestore
                      .doc(`users/${referrerId}`)
                      .collection("notification")
                      .add({
                        date: new Date().toLocaleDateString(),
                        time: new Date().toLocaleTimeString(),
                        amount: referrerpercent,
                        type: "Bonus",
                      });
                      firestore.doc(`users/${currentUserId}`).update({
                        referrer: false,
                      });
                  })

                  .then(() => {
                    console.log("transactions complete");
                    dispatch(loading$());
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
