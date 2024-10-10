export default computeScores = ({ testee, session, answers, specs }) => {
  const getAnswers = (data) => {
    return Object.values(data)
      .sort((a, b) => a.itemId - b.itemId)
      .map((el) => el["answerValue"]);
  }

  const getComponentAnswers = (items, answers) => {
    const answerIndices = items.map((el) => el -1);
    const scaleAllAnswers = answers.filter((_, index) => answerIndices.includes(index))
    return {
      componentAnswers: scaleAllAnswers.filter((el) => el.length > 0),
      componentOmissions: scaleAllAnswers.filter((el) => el.length === 0) || [],
    };
  }

  const computeRawScoreComponent = (items, answers, cb = (el) => el) => {
    // answers is a list of lists: example [[1],[2,4],[1],[5]]
    if (items.length === 0)
      return { componentScore: null, componentOmissions: null, componentMin: null, componentMax: null };
    const { componentAnswers, componentOmissions } = getComponentAnswers(items, answers);
    const componentAnswersFlat = componentAnswers.flat(Infinity).map(el => cb(Number(el)));
    const componentRawScore = componentAnswersFlat.reduce((acc, itr) => acc += itr, 0);
    const { 0: minValue, [componentAnswers.length - 1]: maxValue } = componentAnswersFlat.sort();
    return { 
      componentRawScore, 
      componentOmissions: componentOmissions.length, 
      componentMin: minValue, 
      componentMax: maxValue
    };
  }

  const computeStandardScore = (scaleId, scores, specs, testee, session) => {
    const getNormsFn = specs.norms.getNorms;
    const currentNormsId = eval?.(`"use strict";${getNormsFn};fn(${JSON.stringify({ ...testee, ...session })},"${scaleId}")`);
    const currentNorms = specs.norms[currentNormsId];
    const standardScore =  eval?.(`"use strict";${currentNorms};fn(${JSON.stringify(scores)})`);
    return standardScore;
  }
  
  // init scale scores obj
  let scaleScores = {};
  // get answer values
  const answersValues = getAnswers(answers);
  // compute scores for each scale
  for (const [scaleId, { name, straightItems, reversedItems }] of Object.entries(specs.scales)) {
    // compute straight items component
    const { 
      componentRawScore: straightScore, 
      componentOmissions: straightOmissions, 
      componentMin: straightMin, 
      componentMax: straightMax 
    } = computeRawScoreComponent(straightItems, answersValues);
    // compute reversed items component
    
    const cb = (el) => specs.likert.max + specs.likert.min - el;
    const { 
      componentRawScore: reversedScore, 
      componentOmissions: reversedOmissions, 
      componentMin: reversedMin, 
      componentMax: reversedMax 
    } = computeRawScoreComponent(reversedItems, answersValues, cb);
    // merge components together to get scale scores
    const omissions = (straightOmissions || 0) + (reversedOmissions || 0);
    const rawScore = (straightScore || 0) + (reversedScore || 0);
    const meanScore = Number((rawScore / (straightItems.length + reversedItems.length - omissions)).toFixed(2));
    const minScore = [ straightMin, reversedMin ].filter((el) => el || el === 0).sort().at(0);
    const maxScore = [ straightMax, reversedMax ].filter((el) => el || el === 0).sort().at(-1);
    const scores = { omissions, rawScore, meanScore, minScore, maxScore };
    const standardScore = computeStandardScore(scaleId, scores, specs, testee, session);
    scaleScores = { ...scaleScores, [scaleId] : { scaleId, name, ...scores, standardScore }};
  };
  // return all scales scores
  return scaleScores;
};