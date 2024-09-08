import { initState, exportState, importState, wipeState } from "./useUtilsAlpine";

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
  
  ...initState(Alpine, stateFn),
    
  get urlCurrentBattery() {
    const batteryId = Alpine.store("session").batteryId;
    return this.getUrl([ "batteries", batteryId.charAt(0), batteryId ]);
  },

  get urlCurrentQuestionnaire() {
    const questionnaireId = Alpine.store("session").questionnaireId;
    return this.getUrl([ "questionnaires", questionnaireId ]);
  },

  get exportState() {
    return exportState.call(this, stateFn);
  },

  getUrl(sections) {
    const rootSection = sections[0].charAt(0).toUpperCase() + sections[0].slice(1).toLowerCase();
    return sections.slice(1).reduce((acc, itr, index) => `${acc}${ index == 0 ? '' : '/'}${itr}`, this[`url${rootSection}`]);
  },

  importState(dataJSON) {
    importState.call(this, dataJSON);
  },

  wipeState(omit = []) {
    wipeState.call(this, omit, stateFn) ;
  }
});
