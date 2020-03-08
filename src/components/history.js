import React from "react";
import moment from "moment";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(30),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(6)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const History = props => {
  const classes = useStyles();

  const values = [];
  const keys = Object.keys(localStorage);

  for (let i = 0; i < keys.length; i += 1) {
    if (keys[i].split("-")[0] === "WG") {
      const fromStorgae = JSON.parse(localStorage.getItem(keys[i]));
      values.push(fromStorgae);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h3">
          History
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <h4>Date:</h4>
            </Grid>
            <Grid item xs={3}>
              <h4>ID:</h4>
            </Grid>
            <Grid item xs={3}>
              <h4>Hand:</h4>
            </Grid>
            <Grid item xs={3} />
          </Grid>
          {values.map(element => (
            <Grid container spacing={2} key={element.id}>
              <Grid item xs={3}>
                {`${element.id.substring(0, 5)}...`}
              </Grid>
              <Grid item xs={3}>
                {moment(element.date).format("DD-MM-YYYY")}
              </Grid>
              <Grid item xs={3}>
                {element.startingHand.join("").toUpperCase()}
              </Grid>
              <Grid item xs={3}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  name="game"
                  value={element.startingHand}
                  onClick={props.handleEvent}
                >
                  Play
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            name="menu"
            onClick={props.handleEvent}
          >
            Back to menu
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default History;
