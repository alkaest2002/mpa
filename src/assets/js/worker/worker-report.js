const median = (arr) => {
  if (!arr || arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
};

export default onmessage = async ({ data }) => {
  
  try {
    
    importScripts(data.urls.urlScoringScript, data.urls.urlTemplatingScript);

    const {
      testee,
      session,
      questionnaire: { questionnaireId, answers },
      urls: { urlReportTemplate, urlQuestionnaireSpecs },
    } = data;

    
    // add latencies
    const itemIds = Object.keys(answers);
    const answersLatencies = itemIds.map(
      (itemId) => answers[itemId].answerLatency
    );
    const medianLatency = median(answersLatencies);
    itemIds.forEach((itemId) => {
      answers[itemId]["deltaAnswerLatency"] =
      answers[itemId]?.answerLatency - medianLatency;
    });
    console.log(urlReportTemplate, urlQuestionnaireSpecs)
    
    // fetch report template and questionnaire specs with error handling
    const [ template, specs ] = await Promise.all([
      fetch(urlReportTemplate)
      .then((res) => res.ok ? res.text() : Promise.reject("Failed to load template")),
      fetch(urlQuestionnaireSpecs)
      .then((res) => res.ok ? res.json() : Promise.reject("Failed to load specs"))
    ]);
    
    const questionnireHasScales = Object.keys(specs?.scales || []).length > 0;

    const scores = questionnireHasScales
      ? computeScores({ testee, session, answers, specs })
      : {};

    const normsBiblio = questionnireHasScales
      ? eval?.(
          `"use strict";${specs.norms.getNormsBiblio};fn(${JSON.stringify({
            ...testee,
            ...session,
          })})`
        )
      : {};

    const questionnaireReport = generateReport({
      testee,
      session,
      answers,
      scores,
      normsBiblio: { ref: normsBiblio },
      template,
    });

    postMessage({
      questionnaireId,
      questionnaireScores: scores,
      questionnaireAnswers: answers,
      questionnaireReport,
    });
  } catch (error) {
    postMessage({ error: error.message || "Unknown error occurred" });
  }
};
