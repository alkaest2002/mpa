const computeScores = ({
  testeeData: testee, 
  questionnaireData: data, 
  questionnaireSpecs: specs 
}) => {

  const getAnswersProp = (data, prop = "answerValue") => {
    return Object.values(data)
    .sort((el) => el.order)
    .map((el) => el[prop]);
  }
  
  const computeRawScoreStraight = (_, items, answers) => {
    const answerIndices = items.map((el) => el -1);
    const answersToKeep = answers.filter((_, index) => answerIndices.includes(index));
    const straightItemsOmissions = answersToKeep.filter((el) => el.answerValue == "")?.length || 0;
    const straightItemsRawScore = answersToKeep
      .filter((el) => el.answerValue != "")
      .reduce((acc, itr) => acc + Number(itr), 0);
    return { straightItemsRawScore, straightItemsOmissions };
  }

  const computeRawScoreReversed = ({ likert: { max, min }}, items, answers) => {
    const reversedValue = max + min;
    const answerIndices = items.map((el) => el -1);
    const answersToKeep = answers.filter((_, index) => answerIndices.includes(index));
    const reverseItemsdOmissions = answersToKeep.filter((el) => el.answerValue == "")?.length || 0;
    const reversedItemsRawScore = answersToKeep
      .filter((el) => el.answerValue != "")
      .map((el) => reversedValue - el )
      .reduce((acc, itr) => acc + Number(itr), 0);
    return { reversedItemsRawScore, reverseItemsdOmissions };
  }

  const computeStandardScore = (scaleId, rawScore, specs, testee) => {
    const getNormsFunction = specs.norms.getNorms;
    const currentNormsId = eval?.(`"use strict";${getNormsFunction};fn(${JSON.stringify(testee)},"${scaleId}")`);
    const currentNorms = specs.norms[currentNormsId];
    const standardScore =  eval?.(`"use strict";${currentNorms};fn(${rawScore})`);
    return Math.round(standardScore, 0);
  }
  
  const computeScores = (testee, data, specs) => {
    const answersValues = getAnswersProp(data, "answerValue");
    let scores = {};
    for (const [scaleId, { name, straightItems, reversedItems }] of Object.entries(specs.scales)) {
      const { straightItemsRawScore, straightItemsOmissions } = computeRawScoreStraight(specs, straightItems, answersValues);
      const { reversedItemsRawScore, reverseItemsdOmissions } = computeRawScoreReversed(specs, reversedItems, answersValues);
      const omissions = straightItemsOmissions + reverseItemsdOmissions;
      const rawScore = straightItemsRawScore + reversedItemsRawScore;
      const meanScore = rawScore / (straightItems.length + reversedItems.length - omissions);
      const standardScore = computeStandardScore(scaleId, rawScore, specs, testee);
      scores = { ...scores, [scaleId] : { scaleId, name, rawScore, meanScore, standardScore, omissions }};
    };
    return scores;
  }

  return computeScores(testee, data, specs);
};