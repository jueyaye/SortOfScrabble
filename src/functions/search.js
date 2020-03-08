const allWords = require("../data/words.json");

export const search = (availbleLetters, searchWords) => {
  const words = searchWords || allWords;

  // deconstruct letters used
  const patternByKey = {};
  for (let i = 0; i < availbleLetters.length; i += 1) {
    if (patternByKey[availbleLetters[i]])
      patternByKey[availbleLetters[i]].count += 1;
    else patternByKey[availbleLetters[i]] = { count: 1 };
  }

  // build regex pattern
  let patternString = "^";
  for (let i = 0; i < Object.keys(patternByKey).length; i += 1) {
    const key = Object.keys(patternByKey)[i];
    const letterCount = patternByKey[key].count;

    patternString += `(?!(.*${key}){${letterCount + 1}})`;
  }
  patternString += `[${Object.keys(patternByKey).join()}]*$`;

  const pattern = new RegExp(patternString, "g");

  // filter words on regex pattern O(n)
  const matches = words.filter(element => {
    return element.match(pattern);
  });

  return matches;
};
