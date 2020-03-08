import React, { useState, useEffect } from "react";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import Tile from "./tile.js";

import { score } from "../functions/score";
import { search } from "../functions/search";

const useStyles = makeStyles(theme => ({
  scoreBoard: {
    width: "100%",
    position: "relative",
    padding: "10px",
    border: "3px solid black"
  },
  board: {
    height: "500px",
    width: "100%",
    position: "relative",
    border: "3px solid black"
  },
  gameOptions: {
    height: "180px",
    width: "100%",
    position: "relative",
    padding: "10px",
    border: "3px solid black"
  },
  button: {
    display: "block",
    margin: "10px 0",
    padding: "10px",
    width: "100%",
    height: "100%"
  }
}));

const Board = props => {
  const classes = useStyles();
  let indexId = -1;

  const [state, setState] = useState({
    letters: props.hand.map(a => {
      return {
        id: (indexId += 1),
        value: a.toUpperCase(),
        pos: { x: 0, y: 44 * indexId }
      };
    }),
    score: 0,
    observedWords: [],
    observedWordsString: [],
    validWords: search(props.hand.join("").toUpperCase()),
    taregtLength: props.handSize
  });

  useEffect(() => {
    indexId = -1;

    setState({
      letters: props.hand.map(a => {
        return {
          id: (indexId += 1),
          value: a.toUpperCase(),
          pos: state.letters[indexId].pos
        };
      }),
      score: 0,
      observedWords: [],
      observedWordsString: [],
      validWords: search(props.hand.join("").toUpperCase()),
      taregtLength: props.handSize
    });
  }, [props]);

  const checkRemoveWords = (tile, observedWords) => {
    const scrubbedWords = observedWords;

    for (let i = 0; i < observedWords.length; i += 1) {
      const word = observedWords[i];

      for (let j = 0; j < word.length; j += 1) {
        const observedTile = word[j];

        if (observedTile.id == tile.id) {
          scrubbedWords.splice(i, 1);
        }
      }
    }

    return scrubbedWords;
  };

  const checkAddWords = (letters, newWords) => {
    const { validWords } = state;

    let updatedWordsJSON = [];

    for (let i = 0; i < letters.length; i += 1) {
      const inLineWith = [letters[i]];

      for (let j = 0; j < letters.length; j += 1) {
        if (
          Math.abs(letters[i].pos.y - letters[j].pos.y) < 20 &&
          letters[i].id != letters[j].id
        ) {
          updatedWordsJSON = checkRemoveWords(letters[i], newWords);

          inLineWith.push(letters[j]);
        }
      }
      inLineWith.sort((a, b) => {
        return a.pos.x - b.pos.x;
      });

      const createdWord = inLineWith.map(a => a.value).join("");

      if (inLineWith.length > 1 && validWords.includes(createdWord)) {
        updatedWordsJSON.push(inLineWith);
      }
    }

    return updatedWordsJSON;
  };

  const handleTileChange = tile => {
    const { letters, observedWords, validWords, taregtLength } = state;

    const newLetters = letters.map(a => {
      if (a.id == tile.id) return tile;

      return a;
    });

    let updatedWordsJSON = [];
    const updatedWordsString = [];
    let roundScore = 0;

    // check to see if tile was part of observed words
    updatedWordsJSON = checkRemoveWords(tile, observedWords);

    // check to see if tile forms new words
    updatedWordsJSON = checkAddWords(newLetters, updatedWordsJSON);

    // create string array for scoring
    for (let i = 0; i < updatedWordsJSON.length; i += 1) {
      const wordString = updatedWordsJSON[i].map(a => a.value).join("");
      updatedWordsString.push(wordString);

      // score current play
      roundScore += score(wordString, taregtLength);
    }

    // update state
    setState({
      letters: newLetters,
      score: roundScore,
      observedWords: updatedWordsJSON,
      observedWordsString: updatedWordsString,
      validWords,
      taregtLength: state.taregtLength
    });
  };

  return (
    <>
      <div className={classes.scoreBoard}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h3">
                  Word Game
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Words played: {props.wordsPlayed.join(", ")}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Words to play: {state.observedWordsString.join(", ")}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="h5">
                Game score:
                {props.score}
              </Typography>
              <Typography variant="h6">
                Hand score:
                {state.score}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={props.handleViewBag}
              >
                View bag
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className={classes.board}>
        {state.letters.map(letter => (
          <Tile {...letter} onChange={handleTileChange} key={letter.id} />
        ))}
      </div>
      <div className={classes.gameOptions}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={props.handlePlayRound}
              value={JSON.stringify(state)}
            >
              Play round
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={props.handleEndGame}
            >
              End game
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              className={classes.button}
              onClick={props.handleViewSolution}
            >
              View solution
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              className={classes.button}
              onClick={props.handleSaveGame}
            >
              Save game
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Board;
