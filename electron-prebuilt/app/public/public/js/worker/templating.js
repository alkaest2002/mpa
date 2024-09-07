const generateReport = ({ 
  testeeData: testee, 
  questionnaireData: data, 
  questionnaireScores: scores,
  questionnaireReportTemplate: template 
}) => {

  const converObjectToPlaceholders = (obj, rootKey = null) => {
    let placeHolders = [];
    for (const [key, val] of Object.entries(obj)) {
      if (typeof val === 'object' && !Array.isArray(val)) {
        placeHolders = [...placeHolders, ...converObjectToPlaceholders(val, key)];
      } else {
        placeHolders.push([`${rootKey}#${key}`, val]);
      }
    }
    return [ ...placeHolders ];
  }
  
  const generateQuestionnaireReport = ( testee, data, scores, template ) => {
    let renderedTemplate = template;
    let placeHolders = [];
    placeHolders = [...placeHolders, ...converObjectToPlaceholders(testee, "testee")];
    placeHolders = [...placeHolders, ...converObjectToPlaceholders(data, null)];
    placeHolders = [...placeHolders, ...converObjectToPlaceholders(scores, null)];
    placeHolders.forEach(([key, val]) => {
      renderedTemplate = renderedTemplate.replaceAll(key, val);
    });
    return renderedTemplate;
  }
  
  return generateQuestionnaireReport(testee, data, scores, template);
}
