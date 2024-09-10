import { zipSync, strToU8 } from "fflate";

function processReports(reportsToProcess, baseFileName) {
  let mergedReports = "";
  let reports = {};
  for (const [ reportId, report ] of Object.entries(reportsToProcess)) {
    reports[`${baseFileName}-report-${reportId}.html`] = strToU8(report);
    const reportContent = report.match(/<body[^>]*>((.|[\n\r])*)<\/body>/i)[1].trim();
    const closingBodyTagIndex = mergedReports.lastIndexOf("</body>");
    mergedReports = closingBodyTagIndex == -1 
      ? report
      : mergedReports.slice(0, closingBodyTagIndex) + reportContent + mergedReports.slice(closingBodyTagIndex);
  };
  return {
    [`${baseFileName}-merged-reports.html`]: strToU8(mergedReports),
    reports
  }
}

export default () => ({
  
  getDataToExport() {
    const testeeExport = this.$store.testee.exportState;
    const sessionExport = this.$store.session.exportState;
    const urlsExport = this.$store.urls.exportState;
    return { ...testeeExport, ...sessionExport, ...urlsExport };
  },

  getExportFileName() {
    if (this.$store.testee.testeeDataIsSet) {
      const { surname, name, yearOfBirth } = this.$store.testee.bio;
      return `${surname} ${name} ${yearOfBirth}`
        .toLowerCase()
        .match(/\b\w+\b/g)
        .join("-");
    }
    return "anonymous";
  },

  downloadJSON(dataToExport, filename) {
    const dataBlob = new Blob([JSON.stringify(dataToExport)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    const url = window.URL.createObjectURL(dataBlob);
    const baseFileName = `${filename}-${Date.now()}`;
    link.href = url;
    link.download = `${baseFileName}.json`;
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(
      ":"
    );
    link.click();
    window.URL.revokeObjectURL(url);
  },

  downloadZip(dataToExport, filename) {
    const { session: { reports }} = dataToExport;
    const baseFileName = `${filename}-${Date.now()}`;
    const zippedData = zipSync(
      {
        data: { [`${baseFileName}-session-data.json`]: strToU8(JSON.stringify(dataToExport)) },
        ...processReports(reports, baseFileName)
      },{ level: 9 }
    );
    const dataBlob = new Blob([zippedData], {
      type: "application/octet-stream",
    });
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}-${Date.now()}.zip`;
    link.click();
    window.URL.revokeObjectURL(url);
  },
});
