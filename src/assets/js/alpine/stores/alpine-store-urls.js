import { initState, exportState, importState, wipeState } from "../use/useAlpine";

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
  
  ...initState(stateFn, Alpine),
    
  get urlCurrentBattery() {
    const batteryId = Alpine.store("session").batteryId;
    return batteryId
     ? this.getUrl([ "batteries", batteryId.charAt(0), batteryId ])
     : null;
  },

  get urlCurrentQuestionnaire() {
    const questionnaireId = Alpine.store("session").questionnaireId;
    return questionnaireId
      ? this.getUrl([ "questionnaires", questionnaireId ])
      : null;
  },

  get urlCurrentQuestionnaireMap() {
    return this.urlCurrentQuestionnaire 
      ? `${this.urlCurrentQuestionnaire}/map.html`
      : null;
  },

  get urlCurrentItem() {
    return this.urlItem;
  },

  get exportState() {
    return exportState.call(this, stateFn, "urls");
  },

  getUrl(sections) {
    const rootSection = sections[0].charAt(0).toUpperCase() + sections[0].slice(1).toLowerCase();
    return sections.slice(1).reduce((acc, itr, index) => `${acc}${ index == 0 ? '' : '/'}${itr}`, this[`url${rootSection}`]);
  },

  importState(dataJSON) {
    importState.call(this, dataJSON?.urls);
  },

  wipeState(omit = []) {
    wipeState.call(this, stateFn, omit) ;
  }
});
