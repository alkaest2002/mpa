export default onmessage = async ({ data }) => {
  
  importScripts(data.urls.urlScoringScript, data.urls.urlTemplatingScript);

  const { 
    testee, 
    session, 
    questionnaire: { questionnaireId, answers }, 
    urls: { urlReportTemplate, urlQuestionnaireSpecs }
  } = data;

  const [template, specs] = await Promise.all([
    fetch(urlReportTemplate).then((res) => res.text()), 
    fetch(urlQuestionnaireSpecs).then((res) => res.json())
  ]);
  
  const scores = Object.keys(specs).length > 0 
    ? computeScores({ testee, session, answers, specs })
    : {};
  
  const questionnaireReport = generateReport({ testee, session, answers, scores, template });
  
  postMessage({ 
    questionnaireId,
    questionnaireScores: scores, 
    questionnaireReport,
  });
};
