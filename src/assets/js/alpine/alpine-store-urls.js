import { stateInit, dataToExport, importData, wipeOut } from "./useUtilsAlpine";

const stateFn = () => [
  [ "urlBase", "" ],
  [ "urlSession", "" ],
  [ "urlBatteries", "" ],
  [ "urlQuestionnaires", "" ],
  [ "urlItem", "" ],
  [ "urlReports", "" ],
  [ "urlNotifications", "" ],
  [ "urlTutorial", "" ],
]

export default (Alpine) => ({
  
  ...stateInit(Alpine, stateFn),
    
  get urlCurrentBattery() {
    const batteryId = Alpine.store("session").batteryId;
    return this.getUrl([ "batteries", batteryId.charAt(0), batteryId ]);
  },

  get urlCurrentQuestionnaire() {
    const questionnaireId = Alpine.store("session").questionnaireId;
    return this.getUrl([ "questionnaires", questionnaireId ]);
  },

  get dataToExport() {
    return stateFn()
      .map(([key, _]) => key)
      .reduce((acc, itr) => ({ ...acc, ...{ [itr]: this[itr] }}), {});
  },

  getUrl(sections) {
    const rootSection = sections[0].charAt(0).toUpperCase() + sections[0].slice(1).toLowerCase();
    return sections.slice(1).reduce((acc, itr, index) => `${acc}${ index == 0 ? '' : '/'}${itr}`, this[`url${rootSection}`]);
  },

  importData(dataJSON) {
    this.wipeOut();
    for (const [key, value] of Object.entries(dataJSON)) {
      this[key] && (this[key] = value);
    }
  },

  wipeOut(omit = []){
    stateFn().forEach(([key, defaultValue]) => {
      this[key] = omit.includes(key) ? this[key] : defaultValue;
    })
  }
});
