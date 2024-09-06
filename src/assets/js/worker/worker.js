onmessage = async (e) => {
  importScripts(e.data.urlScoringScript, e.data.urlTemplatingScript);
  const { questionnaireId, questionnaireData, testeeData, urlQuestionnaireSpecs, urlReportTemplate } = e.data;
  const questionnaireReportTemplate = await fetch(urlReportTemplate).then((res) => res.text());
  const questionnaireSpecs = await fetch(urlQuestionnaireSpecs).then((res) => res.json());
  if (Object.keys(questionnaireSpecs ?? {}).length == 0) return;
  const questionnaireScores = computeScores({ testeeData, questionnaireData, questionnaireSpecs });
  const questionnaireReport = generateReport({ testeeData, questionnaireData, questionnaireScores, questionnaireReportTemplate });
  postMessage({ questionnaireId, questionnaireScores, questionnaireReport });
};
