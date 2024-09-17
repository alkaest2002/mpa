import { zipSync, strToU8 } from "fflate";

function processReports({ singleReports, mergedReports }, baseFileName) {
  const reports = Object.fromEntries(
    Object.entries(singleReports).map(([reportId, report]) => [
      `${baseFileName}-report-${reportId}.html`,
      strToU8(report)
    ])
  );
  return {
    [`${baseFileName}-merged-reports.html`]: strToU8(mergedReports),
    reports,
  };
}

function getExportData() {
  const { testee, session, urls } = this.$store;
  return { ...testee.exportState, ...session.exportState, ...urls.exportState };
}

function getBaseFileName() {
  const { surname, name, yearOfBirth } = this.$store.testee.bio;
  return `${surname} ${name} ${yearOfBirth}`
    .toLowerCase()
    .match(/\b\w+\b/g)
    .join("-");
}

function createDownloadLink(blob, filename) {
  const link = document.createElement("a");
  const url = window.URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

export default () => ({
  
  downloadJSON() {
    const baseFileName = getBaseFileName.call(this);
    const dataBlob = new Blob([JSON.stringify(getExportData.call(this))], { type: "application/json" });
    createDownloadLink(dataBlob, `${baseFileName}-${Date.now()}.json`);
  },

  downloadZip() {
    const baseFileName = getBaseFileName.call(this);
    const data = JSON.stringify(getExportData.call(this));
    const { singleReports, mergedReports } = this.$store.reports;
    const zippedData = zipSync(
      {
        [`${baseFileName}-data.json`]: strToU8(data),
        ...processReports({ singleReports, mergedReports }, baseFileName),
      },
      { level: 9 }
    );
    const dataBlob = new Blob([zippedData], { type: "application/octet-stream" });
    createDownloadLink(dataBlob, `${baseFileName}-${Date.now()}.zip`);
  },
});
