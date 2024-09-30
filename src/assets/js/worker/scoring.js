export default computeScores = ({ testee, session, answers, specs }) => {

  const getAnswersValues = (data) => {
    return Object.values(data)
      .sort((a, b) => a.itemId - b.itemId)
      .map((el) => el["answerValue"].reduce((acc, itr) => acc += itr, 0));
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

  const computeStandardScore = (scaleId, rawScore, meanScore, specs, testee, session) => {
    const getNormsFn = specs.norms.getNorms;
    const currentNormsId = eval?.(`"use strict";${getNormsFn};fn(${JSON.stringify({ ...testee, ...session })},"${scaleId}")`);
    const currentNorms = specs.norms[currentNormsId];
    const standardScore =  eval?.(`"use strict";${currentNorms};fn(${JSON.stringify({ rawScore, meanScore })})`);
    return standardScore;
  }
  
  let scores = {};
  const answersValues = getAnswersValues(answers)
  for (const [scaleId, { name, straightItems, reversedItems }] of Object.entries(specs.scales)) {
    const { straightScore, straightOmissions } = computeRawScoreStraight(specs, straightItems, answersValues);
    const { reversedScore, reversedOmissions } = computeRawScoreReversed(specs, reversedItems, answersValues);
    const omissions = straightOmissions + reversedOmissions;
    const rawScore = straightScore + reversedScore;
    const meanScore = Number((rawScore / (straightItems.length + reversedItems.length - omissions)).toFixed(2));
    const standardScore = computeStandardScore(scaleId, rawScore, meanScore, specs, testee, session);
    scores = { ...scores, [scaleId] : { scaleId, name, rawScore, meanScore, standardScore, omissions }};
  };
  return scores;
};