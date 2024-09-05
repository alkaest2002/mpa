export default (Alpine) => ({
  urlBase: Alpine.$persist("").using(sessionStorage),
  urlSession: Alpine.$persist("").using(sessionStorage),
  urlBatteries: Alpine.$persist("").using(sessionStorage),
  urlQuestionnaires: Alpine.$persist("").using(sessionStorage),
  urlItem: Alpine.$persist("").using(sessionStorage),
  urlReports: Alpine.$persist("").using(sessionStorage),
  urlNotifications: Alpine.$persist("").using(sessionStorage),
  urlTutorial: Alpine.$persist("").using(sessionStorage),
    
  get urlCurrentBattery() {
    const batteryId = Alpine.store("session").batteryId;
    return this.getUrl([ "batteries", batteryId.charAt(0), batteryId ]);
  },

  get urlCurrentQuestionnaire() {
    const questionnaireId = Alpine.store("session").questionnaireId;
    return this.getUrl([ "questionnaires", questionnaireId ]);
  },

  get dataToExport() {
    return [
      "urlBase", "urlSession", "urlBatteries","urlQuestionnaires",
      "urlItem","urlReports","urlNotifications","urlTutorial"
    ].reduce((acc, itr) => ({ ...acc, ...{ [itr]: this[itr]}}), {});
  },

  importData(dataJSON) {
    this.wipeOut();
    for (const [key, val] of Object.entries(dataJSON)) {
      if (key in this) this[key] = val;
    }
  },

  getUrl(sections) {
    const rootSection = sections[0].charAt(0).toUpperCase() + sections[0].slice(1).toLowerCase();
    return sections.slice(1).reduce((acc, itr, index) => `${acc}${ index == 0 ? '' : '/'}${itr}`, this[`url${rootSection}`]);
  },

  wipeOut(omit = []) {
    this.urlBase = omit.includes("urlBase") ? this.urlBase : "";
    this.urlSession = omit.includes("urlSession") ? this.urlSession : "";
    this.urlBatteries = omit.includes("urlBatteries") ? this.urlBatteries : "";
    this.urlQuestionnaires = omit.includes("urlQuestionnaires") ? this.urlQuestionnaires : "";
    this.urlItem = omit.includes("urlItem") ? this.urlItem : "";
    this.urlNotifications = omit.includes("urlNotifications") ? this.urlNotifications : "";
    this.urlTutorial = omit.includes("urlTutorial") ? this.urlTutorial : "";
  }
});
