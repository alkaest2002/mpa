(()=>{var m=onmessage=async({data:e})=>{importScripts(e.urls.urlScoringScript,e.urls.urlTemplatingScript);let{testee:t,session:r,questionnaire:{questionnaireId:c,answers:n},urls:{urlReportTemplate:p,urlQuestionnaireSpecs:l}}=e,[u,o]=await Promise.all([fetch(p).then(s=>s.text()),fetch(l).then(s=>s.json())]),i=Object.keys(o).length>0?computeScores({testee:t,session:r,answers:n,specs:o}):{},a=generateReport({testee:t,session:r,answers:n,scores:i,template:u});postMessage({questionnaireId:c,questionnaireScores:i,questionnaireReport:a})};})();