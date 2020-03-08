const letterValues = require("../data/letter-values.json");

export const score = (word, targetLength) => {
  let score = 0;

  // sum of the scores of each letter
  for (let i = 0; i < word.length; i += 1) {
    score += letterValues[word[i].toLowerCase()];
  }
  // multiplied by the length of the word
  score *= word.length;

  // if all letters are used +50 points
  // eslint-disable-next-line
  if (word.length == targetLength)
    score += 50;

  return score;
};
