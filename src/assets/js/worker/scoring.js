export default computeScores = ({ testee, session, answers, specs }) => {

  const getAnswersProp = (data, prop = "answerValue") => {
    return Object.values(data)
    .sort((el) => el.order)
    .map((el) => el[prop]);
  }
  
  const computeRawScoreStraight = (_, items, answers) => {
    const answerIndices = items.map((el) => el -1);
    const answersToKeep = answers.filter((_, index) => answerIndices.includes(index));
    const straightOmissions = answersToKeep.filter((el) => el.answerValue == "")?.length || 0;
    const straightScore = answersToKeep
      .filter((el) => el.answerValue != "")
      .reduce((acc, itr) => acc + Number(itr), 0);
    return { straightScore, straightOmissions };
  }

  const computeRawScoreReversed = ({ likert: { max, min }}, items, answers) => {
    const reversedValue = max + min;
    const answerIndices = items.map((el) => el -1);
    const answersToKeep = answers.filter((_, index) => answerIndices.includes(index));
    const reversedOmissions = answersToKeep.filter((el) => el.answerValue == "")?.length || 0;
    const reversedScore = answersToKeep
      .filter((el) => el.answerValue != "")
      .map((el) => reversedValue - el )
      .reduce((acc, itr) => acc + Number(itr), 0);
    return { reversedScore, reversedOmissions };
  }

  const computeStandardScore = (scaleId, rawScore, specs, testee, session) => {
    const getNormsFunction = specs.norms.getNorms;
    const currentNormsId = eval?.(`"use strict";${getNormsFunction};fn(${JSON.stringify({ ...testee, ...session })},"${scaleId}")`);
    const currentNorms = specs.norms[currentNormsId];
    const standardScore =  eval?.(`"use strict";${currentNorms};fn(${rawScore})`);
    return Math.round(standardScore, 0);
  }
  
  let scores = {};
  const answersValues = getAnswersProp(answers, "answerValue");
  for (const [scaleId, { name, straightItems, reversedItems }] of Object.entries(specs.scales)) {
    const { straightScore, straightOmissions } = computeRawScoreStraight(specs, straightItems, answersValues);
    const { reversedScore, reversedOmissions } = computeRawScoreReversed(specs, reversedItems, answersValues);
    const omissions = straightOmissions + reversedOmissions;
    const rawScore = straightScore + reversedScore;
    const meanScore = rawScore / (straightItems.length + reversedItems.length - omissions);
    const standardScore = computeStandardScore(scaleId, rawScore, specs, testee, session);
    scores = { ...scores, [scaleId] : { scaleId, name, rawScore, meanScore, standardScore, omissions }};
  };
  
  return scores;
};