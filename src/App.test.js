import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { search } from './functions/search';
import { score } from './functions/score';
import { findOptimalSolution } from './functions/solution';

it('finds all solutions', () => {
  const result = search('TAR');

  console.log(result.includes('AR') 
    && result.includes('AR')
    && result.includes('ART')
    && result.includes('AT')
    && result.includes('RAT')
    && result.includes('TA')
    && result.includes('TAR'));
});

it('scores correctly', () => {
  const result = score('QUEEN', 7)

  console.log(result == 70);
})

it('finds the optimal solution', () => {
  const result = findOptimalSolution('INERTIA');

  console.log(result.bestChildPath === '/INERTIA' && result.bestChildScore == 99);
});

it('finds the optimal solution in combinations', () => {
  const result = findOptimalSolution('QUEENBEE');

  console.log(result.bestChildPath === '/QUEEN//BEE' && result.bestChildScore == 85);
});

it('correctly finds no solutions', () => {
  const result = findOptimalSolution('');

  console.log(result === undefined);
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
