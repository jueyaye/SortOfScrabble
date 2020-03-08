const { search } = require("./search");
const { score } = require("./score");

export const findAllSolutions = (parentFilter, parentSearch, targetLength) => {
  const result = [];

  for (let i = 0; i < parentSearch.length; i += 1) {
    const word = parentSearch[i];

    let childFilter = parentFilter;

    for (let j = 0; j < word.length; j += 1) {
      const replaceAt = childFilter.indexOf(word[j]);

      childFilter =
        childFilter.substr(0, replaceAt) +
        childFilter.substr(replaceAt + 1, childFilter.length);
    }

    const childSearch = search(childFilter, parentSearch);
    const childScore = score(word, targetLength);

    const nextWords = findAllSolutions(childFilter, childSearch, targetLength);
    const bestNext = nextWords.sort((a, b) => {
      return b.bestChildScore - a.bestChildScore;
    })[0];

    let nextScore = childScore;
    let nextPath = `/${word}`;

    if (nextWords.length > 0) {
      nextScore += bestNext.bestChildScore;
      nextPath += `/${bestNext.bestChildPath}`;
    }

    result.push({
      word,
      score: childScore,
      bestChildScore: nextScore,
      bestChildPath: nextPath,
      nextWords
    });
  }

  return result;
};

export const findOptimalSolution = availbleLetters => {
  const targetLength = 7; // i.e. use all letters

  const initialSearch = search(availbleLetters);

  const solutions = findAllSolutions(
    availbleLetters,
    initialSearch,
    targetLength
  );
  solutions.sort((a, b) => {
    return b.bestChildScore - a.bestChildScore;
  });

  return solutions[0];
};
