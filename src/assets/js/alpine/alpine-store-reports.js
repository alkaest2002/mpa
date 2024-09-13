import { initState, exportState, importState, wipeState } from "./useAlpine";

const stateFn = () => [
  [ "singleReports", {} ],
  [ "mergedReports", "" ],
  [ "generatingReports", false ],
]

export default (Alpine) => ({
  
  ...initState(stateFn, Alpine),

  get exportState() {
    return exportState.call(this, stateFn, "reports");
  },

  importState(dataJSON) {
    importState.call(this, dataJSON?.reports);
  },

  wipeState(omit = []) {
    wipeState.call(this, stateFn, omit) ;
  }
});
