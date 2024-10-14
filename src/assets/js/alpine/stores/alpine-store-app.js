import { initState, wipeState } from "../use/useAlpineStore";

const stateFn = () => [
  [ "currentView", "" ],
  [ "tutorialSwitch", "on" ],
  [ "autoPilotSwitch", "on" ],
  [ "burgerIsOpen", false ],
  [ "envIsDevelopment", false]
]

export default (Alpine) => ({
  
  ...initState(stateFn, Alpine),

  wipeState(omit = []) {
    wipeState.call(this, stateFn, omit) ;
  }
});
