const scrabbleDistribution = require("../data/scrabble-bag.json");

export const shuffle = array => {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

export const newScrabbleBag = () => {
  const bag = [];

  for (let i = 0; i < Object.keys(scrabbleDistribution).length; i += 1) {
    const letter = Object.keys(scrabbleDistribution)[i];

    for (let j = 0; j < scrabbleDistribution[letter]; j += 1) {
      bag.push(letter);
    }
  }

  return shuffle(bag);
};

export const newCustomBag = customDistribution => {
  const bag = [];

  for (let i = 0; i < Object.keys(customDistribution).length; i += 1) {
    const letter = Object.keys(customDistribution)[i];

    for (let j = 0; j < customDistribution[letter]; j += 1) {
      bag.push(letter);
    }
  }

  return shuffle(bag);
};
