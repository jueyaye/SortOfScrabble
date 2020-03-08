import React, { useState, useEffect } from "react";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/Card";

import Draggable from "react-draggable";

const useStyles = makeStyles(() => ({
  card: {
    width: "40px"
  },
  title: {
    fontSize: 24,
    "text-align": "center"
  },
  board: {
    height: "500px",
    width: "500px",
    position: "relative"
  },
  hand: {
    height: "300px",
    width: "500px",
    "background-color": "lightgreen"
  }
}));

const Tile = props => {
  const classes = useStyles();

  const [state, setState] = useState(props);

  useEffect(() => {
    setState(props);
  }, [props]);

  const onStop = () => {
    props.onChange(state);
  };

  const handleDrag = (e, ui) => {
    const { id, value, pos } = state;

    const xDash = pos.x + ui.deltaX;
    const yDash = pos.y + ui.deltaY;

    setState({
      id,
      value,
      pos: {
        x: xDash,
        y: yDash
      }
    });
  };

  return (
    <Draggable
      bounds="parent"
      grid={[10, 10]}
      onDrag={handleDrag}
      onStop={onStop}
    >
      <Card className={classes.card}>
        <CardContent>
          <Typography
            className={classes.title}
            color="textPrimary"
            gutterBottom
          >
            {state.value}
          </Typography>
        </CardContent>
      </Card>
    </Draggable>
  );
};

export default Tile;
