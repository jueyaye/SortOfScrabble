import React, { useState } from 'react';

import Menu from './components/menu';
import Game from './components/game';
import History from './components/history';

const App = () => {
  const [state, setState] = useState({
    appState: 'menu',
    extras: null
  });

  const handleStateEvent = (e) => {
    e.preventDefault();
    setState({
      appState: e.currentTarget.name,
      extras: e.currentTarget.value
    });
  };

  const NoRouterRouting = (props) => {
    const { state } = props;

    if (state.appState === "menu")
      return <Menu handleEvent={handleStateEvent}></Menu>;
    
    if (state.appState === "game")
      return <Game handleEvent={handleStateEvent} existingStartingHand={state.extras}></Game>

    if (state.appState === "history")
      return <History handleEvent={handleStateEvent}></History>

    return <h1>Error state</h1>
  };

  return (
    <>
      <NoRouterRouting state={state}/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    </>
  );
};

export default App;
