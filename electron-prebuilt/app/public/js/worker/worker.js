onmessage = async (e) => {
  importScripts(e.data.urlScoringScript, e.data.urlTemplatingScript);
  const { 
    settingId, questionnaireId, questionnaireData, testeeData, urlQuestionnaireSpecs, urlReportTemplate,
  } = e.data;
  const questionnaireSpecs = await fetch(urlQuestionnaireSpecs).then((res) => res.json());
  if (Object.keys(questionnaireSpecs ?? {}).length == 0) return;
  const questionnaireReportTemplate = await fetch(urlReportTemplate).then((res) => res.text());
  const questionnaireScores = computeScores({ settingId, testeeData, questionnaireData, questionnaireSpecs });
  const { renderedReport } = generateReport({ testeeData, questionnaireData, questionnaireScores, questionnaireReportTemplate });
  console.log("report generated", questionnaireId);
  postMessage({ questionnaireId, questionnaireScores, questionnaireReport: renderedReport });
};
