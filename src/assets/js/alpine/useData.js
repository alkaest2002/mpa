import { zipSync, strToU8 } from "fflate";

export default () => ({

  getDataToExport() {
    const testeeData = this.$store.testee.dataToExport;
    const sessionData = this.$store.session.dataToExport;
    const urlsData = this.$store.urls.dataToExport;
    const dataToExport = { ...testeeData, ...sessionData, ...urlsData };
    const condition1 = !this.$store.testee.testeeDataIsSet;
    const condition2 = Object.values(sessionData.data.batteries)
      .map((battery) => Object.keys(battery.questionnaires)
        .some(questionnaireId => !Object.keys(sessionData.reports).includes(questionnaireId)))
      .some(Boolean);
    return [condition1, condition2].some(Boolean)
      ? null
      : dataToExport;
  },

  getExportFileName() {
    if (this.$store.testee.testeeDataIsSet) {
      const { surname, name, yearOfBirth } = this.$store.testee.bio;
      return `${surname} ${name} ${yearOfBirth}`.toLowerCase().match(/\b\w+\b/g).join("-"); 
    }
    return "anonymous";
  },

  downloadJSON(dataToExport, filename) {
    const dataBlob = new Blob([JSON.stringify(dataToExport)], { type: "application/json" });
    const link = document.createElement("a");
    const url = window.URL.createObjectURL(dataBlob);
    const baseFileName = `${filename}-${Date.now()}`;
    link.href = url;
    link.download = `${baseFileName}.json`;
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");
    link.click();
    window.URL.revokeObjectURL(url);
  },

  downloadZip(dataToExport, filename) {
    const baseFileName = `${filename}-${Date.now()}`;
    const { reports } = dataToExport;
    let u8Reports = {}
    for (const [reportId, report ] of Object.entries(reports)) {
      u8Reports[`${baseFileName}-report-${reportId}.html`] = strToU8(report);
    }
    const u8Data = strToU8(JSON.stringify(dataToExport));
    const zippedData = zipSync({ 
      data: { [`${baseFileName}-session-data.json`]: u8Data },
      reports: u8Reports,
    }, { level: 9 });
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

})