import { initState, wipeState } from "./useUtilsAlpine";

const stateFn = () => [
  [ "currentView", "" ],
  [ "tutorialSwitch", "on" ],
  [ "autoPilotSwitch", "on" ],
  [ "burgerIsOpen", false ]
]

export default (Alpine) => ({
  
  ...initState(Alpine, stateFn),

  wipeState(omit = []) {
    wipeState.call(this, omit, stateFn) ;
  }
});
