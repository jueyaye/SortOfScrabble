import React, { useState, useEffect } from "react";
import uuid from "uuid/v4";

import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Modal from "@material-ui/core/Modal";

import Board from "./board";

import { newScrabbleBag, newCustomBag, shuffle } from "../functions/bag";

import { findOptimalSolution } from "../functions/solution";
import { search } from "../functions/search";

import scrabbleBag from "../data/scrabble-bag.json";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  paperModal: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: `50%`,
    left: `50%`,
    transform: "translate(-50%, -50%)"
  },
  bagModal: {
    height: "500px",
    overflow: "auto",
    position: "relative",
    width: "100%",
    padding: "10px"
  }
}));

const Game = props => {
  const classes = useStyles();

  const [state, setState] = useState({
    handSize: 7,
    round: 0,
    score: 0,
    wordsPlayed: [],
    letterBag: newScrabbleBag(),
    startingHand: [],
    currentHand: [],
    ui: {
      openStartModal: true,
      openBagModal: false,
      openSaveModal: false,
      openSolutionModal: false,
      openClosModal: false,
      openEndModal: false
    },
    bagType: "scrabble",
    bagTemplate: scrabbleBag
  });

  useEffect(() => {
    const currentBag = state.letterBag;
    let newHand = [];

    if (props.existingStartingHand) {
      newHand = props.existingStartingHand.split(",");

      for (let i = 0; i < newHand.length; i += 1) {
        currentBag.splice(currentBag.indexOf(newHand[i]), 1);
      }
    } else {
      for (let i = 0; i < state.handSize; i += 1) {
        newHand.push(currentBag.pop());
      }
    }

    setState({
      handSize: state.handSize,
      round: state.round,
      score: state.score,
      wordsPlayed: state.wordsPlayed,
      letterBag: currentBag,
      startingHand: newHand,
      currentHand: newHand,
      ui: state.ui,
      bagType: state.bagType,
      bagTemplate: state.bagTemplate
    });
  }, []);

  /**
   * Component event handlers
   */
  const handlePlayRound = e => {
    const round = JSON.parse(e.currentTarget.value);
    const usedLetters = round.observedWordsString.join("");

    const currentBag = state.letterBag;
    const newHand = state.currentHand;

    if (usedLetters.length > 0) {
      // remove used letters
      for (let i = 0; i < usedLetters.length; i += 1) {
        const letterIndex = newHand.indexOf(usedLetters[i].toLowerCase());

        newHand.splice(letterIndex, 1);
      }

      // add new letters from the bag
      for (let i = 0; i < usedLetters.length && currentBag.length > 0; i += 1) {
        newHand.push(currentBag.pop());
      }
    }

    setState({
      handSize: state.handSize,
      round: state.round + 1,
      score: state.score + round.score,
      wordsPlayed: state.wordsPlayed.concat(round.observedWordsString),
      letterBag: currentBag,
      startingHand: state.startingHand,
      currentHand: newHand,
      ui: {
        ...state.ui,
        openEndModal: (search(newHand.join("").toUpperCase()).length == 0) ? true : false
      },
      bagType: state.bagType,
      bagTemplate: state.bagTemplate
    });
  };

  const toggleEndGameModal = () => {
    setState({
      ...state,
      ui: {
        ...state.ui,
        openEndModal: !state.ui.openEndModal
      }
    });
  };

  const toggleSolutionModal = () => {
    setState({
      ...state,
      ui: {
        ...state.ui,
        openSolutionModal: !state.ui.openSolutionModal
      }
    });
  };

  const toggleBagModal = () => {
    setState({
      ...state,
      ui: {
        ...state.ui,
        openBagModal: !state.ui.openBagModal
      }
    });
  };

  const toggleStartModal = () => {
    setState({
      ...state,
      ui: {
        ...state.ui,
        openStartModal: !state.ui.openStartModal
      }
    });
  };

  const toggleBagType = e => {
    setState({
      ...state,
      bagType: e.currentTarget.value
    });
  };

  const StartGameModal = () => {
    const { bagType, bagTemplate } = state;
    let counter = 1;

    return (
      <Modal
        disableBackdropClick
        open={state.ui.openStartModal}
        onClose={toggleStartModal}
      >
        <div className={classes.paperModal}>
          <div>
            <FormControl component="fieldset">
              <FormLabel component="legend">Board Type</FormLabel>
              <RadioGroup value={bagType} onChange={toggleBagType}>
                <FormControlLabel
                  value="scrabble"
                  control={<Radio />}
                  label="Scrabble"
                />
                <FormControlLabel
                  value="custom"
                  control={<Radio />}
                  label="Custom"
                />
              </RadioGroup>
            </FormControl>
          </div>
          {bagType === "custom" ? (
            <div className={classes.bagModal}>
              <Grid container spacing={2}>
                {Object.keys(bagTemplate).map(element => (
                  <Grid item xs={3} key={(counter += 1)}>
                    <TextField
                      label={element.toUpperCase()}
                      value={bagTemplate[element]}
                      onChange={handleUpdateBagType(element)}
                      type="number"
                      InputLabelProps={{
                        shrink: true
                      }}
                      margin="normal"
                    />
                  </Grid>
                ))}
              </Grid>
            </div>
          ) : null}
          <Grid container spacing={2} style={{ marginTop: "10px" }}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleStartGame}
              >
                Start game
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={handleBackToMenu}
                name="menu"
              >
                Back to menu
              </Button>
            </Grid>
          </Grid>
        </div>
      </Modal>
    );
  };

  const LetterBagModal = () => {
    const { letterBag } = state;
    let counter = 1;

    return (
      <Modal open={state.ui.openBagModal} onClose={toggleBagModal}>
        <div className={classes.paperModal}>
          <div className={classes.bagModal}>
            <Grid container spacing={2}>
              {shuffle(letterBag).map(element => (
                <Grid item xs={3} key={(counter += 1)}>
                  {element.toUpperCase()}
                </Grid>
              ))}
            </Grid>
          </div>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={toggleBagModal}
            style={{ marginTop: "50px" }}
          >
            Back to game
          </Button>
        </div>
      </Modal>
    );
  };

  const EndGameModal = () => {
    return (
      <Modal
        disableBackdropClick
        open={state.ui.openEndModal}
        onClose={toggleEndGameModal}
      >
        <div className={classes.paperModal}>
          <h2>Game ended...</h2>
          <h4>Score:</h4>
          <p>{state.score}</p>
          <h4>Words played:</h4>
          <p>{state.wordsPlayed.join(", ")}</p>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleBackToMenu}
                name="menu"
              >
                Back to menu
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={handleSaveGame}
              >
                Save game
              </Button>
            </Grid>
          </Grid>
        </div>
      </Modal>
    );
  };

  const ViewSolutionsModal = () => {
    const solution = findOptimalSolution(
      state.currentHand.join("").toUpperCase()
    );
    let solutionBody;
    if (solution) {
      solutionBody = solution.bestChildPath.split("/").splice(1);

      for (let i = 0; i < solutionBody.length; i += 1) {
        if (solutionBody[i] === "") solutionBody.splice(i, 1);
      }
    }

    return (
      <Modal open={state.ui.openSolutionModal} onClose={toggleSolutionModal}>
        <div className={classes.paperModal}>
          <h2>Cheat book</h2>
          <h4>Best solution:</h4>
          <h5>Score:</h5>
          {solution ? solution.bestChildScore : 0}
          <h5>Hand to play:</h5>
          {solutionBody ? solutionBody.join(", ") : ""}
          <Grid container spacing={2} style={{ marginTop: "10px" }}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={toggleSolutionModal}
              >
                Back to game
              </Button>
            </Grid>
          </Grid>
        </div>
      </Modal>
    );
  };

  const handleStartGame = () => {
    const { handSize, bagType, bagTemplate } = state;

    if (bagType === "custom") {
      const newBag = newCustomBag(bagTemplate);
      const newHand = [];

      for (let i = 0; i < handSize; i += 1) {
        newHand.push(newBag.pop());
      }

      setState({
        ...state,
        letterBag: newBag,
        startingHand: newHand,
        currentHand: newHand,
        ui: {
          ...state.ui,
          openStartModal: !state.ui.openStartModal
        }
      });
    } else {
      setState({
        ...state,
        ui: {
          ...state.ui,
          openStartModal: !state.ui.openStartModal
        }
      });
    }
  };

  const handleUpdateBagType = name => e => {
    setState({
      ...state,
      bagTemplate: {
        ...state.bagTemplate,
        [name]: e.target.value
      }
    });
  };

  const handleSaveGame = () => {
    localStorage.setItem(
      `WG-${uuid()}`,
      JSON.stringify({
        id: uuid(),
        startingHand: state.startingHand,
        date: Date.now()
      })
    );

    alert("Your game has been saved.");
  };

  const handleBackToMenu = e => {
    setState({
      handSize: 7,
      round: 0,
      score: 0,
      wordsPlayed: [],
      letterBag: newScrabbleBag(),
      startingHand: [],
      currentHand: [],
      ui: {
        openStartModal: false,
        openSaveModal: false,
        openSolutionModal: false,
        openClosModal: false,
        openEndModal: false
      },
      bagType: state.bagType,
      bagTemplate: state.bagTemplate
    });

    props.handleEvent(e);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {state.currentHand.length > 0 ? (
          <Board
            hand={state.currentHand}
            handSize={state.handSize}
            round={state.round}
            score={state.score}
            wordsPlayed={state.wordsPlayed}
            handlePlayRound={handlePlayRound}
            handleSaveGame={handleSaveGame}
            handleViewBag={toggleBagModal}
            handleViewSolution={toggleSolutionModal}
            handleEndGame={toggleEndGameModal}
          />
        ) : <EndGameModal /> // an end game state...
        }
        <EndGameModal />
        <ViewSolutionsModal />
        <LetterBagModal />
        <StartGameModal />
      </div>
    </Container>
  );
};

export default Game;
