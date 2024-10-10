export default onmessage = async ({ data }) => {
  const { singleReports: reportsToProcess } = data;
  let mergedReports = "";
  for (const [ _, report ] of Object.entries(reportsToProcess)) {
    const reportContent = report.match(/<body[^>]*>((.|[\n\r])*)<\/body>/i)[1].trim();
    const closingBodyTagIndex = mergedReports.lastIndexOf("</body>");
    mergedReports = closingBodyTagIndex == -1 
      ? report
      : mergedReports.slice(0, closingBodyTagIndex) 
        + reportContent 
        + mergedReports.slice(closingBodyTagIndex);
  };
  postMessage({ mergedReports });
};
