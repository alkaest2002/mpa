import { zipSync, strToU8 } from "fflate";

function processReports({ singleReports, mergedReports }, baseFileName) {
  let reports = {};
  for (const [ reportId, report ] of Object.entries(singleReports)) {
    reports[`${baseFileName}-report-${reportId}.html`] = strToU8(report);
  };
  return { 
    [`${baseFileName}-merged-reports.html`]: strToU8(mergedReports), 
    reports
  }
}

function dataToExport() {
  const testeeExport = this.$store.testee.exportState;
  const sessionExport = this.$store.session.exportState;
  const urlsExport = this.$store.urls.exportState;
  return { ...testeeExport, ...sessionExport, ...urlsExport };
};

function exportFileName() {
  const { surname, name, yearOfBirth } = this.$store.testee.bio;
  return `${surname} ${name} ${yearOfBirth}`
    .toLowerCase()
    .match(/\b\w+\b/g)
    .join("-");
};

export default () => ({
  
  downloadJSON() {
    const baseFileName = exportFileName.call(this);
    const data = dataToExport.call(this);
    const dataBlob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const link = document.createElement("a");
    const url = window.URL.createObjectURL(dataBlob);
    const filename = `${baseFileName}-${Date.now()}`;
    link.href = url;
    link.download = `${filename}.json`;
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");
    link.click();
    window.URL.revokeObjectURL(url);
  },

  downloadZip() {
    const baseFileName = exportFileName.call(this);
    const data = dataToExport.call(this);
    const { singleReports, mergedReports } = this.$store.reports;
    const zippedData = zipSync(
      {
        data: { [`${baseFileName}-data.json`]: strToU8(JSON.stringify(data)) },
        ...processReports({ singleReports, mergedReports }, baseFileName)
      }, { level: 9 }
    );
    const dataBlob = new Blob([ zippedData ], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${baseFileName}-${Date.now()}.zip`;
    link.click();
    window.URL.revokeObjectURL(url);
  },
});
