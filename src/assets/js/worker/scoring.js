export default computeScores = ({ testee, session, answers, specs }) => {

  const getAnswers = (data) => {
    return Object.values(data)
      .sort((a, b) => a.itemId - b.itemId)
      .map((el) => el["answerValue"]);
  }

  const getScaleAnswers = (items, answers) => {
    const answerIndices = items.map((el) => el -1);
    const scaleAllAnswers = answers.filter((_, index) => answerIndices.includes(index))
    return {
      scaleAnswers: scaleAllAnswers.filter((el) => el.length > 0),
      scaleOmissions: scaleAllAnswers.filter((el) => el.length === 0) || [],
    };
  }
  
  const computeRawScoreStraight = (_, items, answers) => {
    // answers is a list of lists: example [[1],[2,4],[1],[5]]
    if (items.length === 0)
      return { straightScore: null, straightOmissions: null, straightMin: null, straightMax: null };
    const { scaleAnswers, scaleOmissions } = getScaleAnswers(items, answers);
    const flattenedScaleAnswers = scaleAnswers.flat(Infinity);
    const straightScore = flattenedScaleAnswers.reduce((acc, itr) => acc += Number(itr), 0);
    const { 0: minValue, [scaleAnswers.length - 1]: maxValue } = flattenedScaleAnswers.sort();
    return { 
      straightScore, 
      straightOmissions: scaleOmissions.length, 
      straightMin: minValue, 
      straightMax: maxValue
    };
  }

  const computeRawScoreReversed = ({ likert: { max, min }}, items, answers) => {
    // answers is a list of lists: example [[1],[2,4],[1],[5]]
    if (items.length === 0)
      return { reversedScore: null, reversedOmissions: null, reversedMin: null, reversedMax: null };
    const { scaleAnswers, scaleOmissions } = getScaleAnswers(items, answers);
    const flattenedScaleAnswers = scaleAnswers.flat(Infinity);
    const reversedValue = Number(max + min);
    const reversedScore = flattenedScaleAnswers.reduce((acc, itr) => acc += reversedValue - Number(itr));
    const { 0: minValue, [scaleAnswers.length - 1]: maxValue } = flattenedScaleAnswers.sort();
    return { 
      reversedScore, 
      reversedOmissions: scaleOmissions.length, 
      reversedMin: reversedValue - maxValue, 
      reversedMax: reversedValue - minValue
    };
  }

  const computeStandardScore = (scaleId, scores, specs, testee, session) => {
    const getNormsFn = specs.norms.getNorms;
    const currentNormsId = eval?.(`"use strict";${getNormsFn};fn(${JSON.stringify({ ...testee, ...session })},"${scaleId}")`);
    const currentNorms = specs.norms[currentNormsId];
    const standardScore =  eval?.(`"use strict";${currentNorms};fn(${JSON.stringify(scores)})`);
    return standardScore;
  }
  
  // init var
  let allScores = {};
  // get answer values
  const answersValues = getAnswers(answers);
  // compute scores for each scale
  for (const [scaleId, { name, straightItems, reversedItems }] of Object.entries(specs.scales)) {
    const { straightScore, straightOmissions, straightMin, straightMax } = computeRawScoreStraight(specs, straightItems, answersValues);
    const { reversedScore, reversedOmissions, reversedMin, reversedMax } = computeRawScoreReversed(specs, reversedItems, answersValues);
    const omissions = (straightOmissions || 0) + (reversedOmissions || 0);
    const rawScore = (straightScore || 0) + (reversedScore || 0);
    const meanScore = Number((rawScore / (straightItems.length + reversedItems.length - omissions)).toFixed(2));
    const minScore = [ straightMin, reversedMin ].filter((el) => el || el === 0).sort().at(0);
    const maxScore = [ straightMax, reversedMax ].filter((el) => el || el === 0).sort().at(-1);
    const scores = { omissions, rawScore, meanScore, minScore, maxScore };
    const standardScore = computeStandardScore(scaleId, scores, specs, testee, session);
    allScores = { ...allScores, [scaleId] : { scaleId, name, ...scores, standardScore }};
  };
  // return all scales scores
  return allScores;
};