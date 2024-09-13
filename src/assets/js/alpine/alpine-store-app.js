import { initState, wipeState } from "./useAlpine";

const stateFn = () => [
  [ "currentView", "" ],
  [ "tutorialSwitch", "on" ],
  [ "autoPilotSwitch", "on" ],
  [ "burgerIsOpen", false ],
]

export default (Alpine) => ({
  
  ...initState(stateFn, Alpine),

  wipeState(omit = []) {
    wipeState.call(this, stateFn, omit) ;
  }
});
