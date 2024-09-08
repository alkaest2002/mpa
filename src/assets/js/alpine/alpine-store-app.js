import { stateInit, wipeOut } from "./useUtilsAlpine";

const stateFn = () => [
  [ "currentView", "" ],
  [ "tutorialSwitch", "on" ],
  [ "autoPilotSwitch", "on" ],
  [ "burgerIsOpen", false ]
]

export default (Alpine) => ({
  
  ...stateInit(Alpine, stateFn),

  wipeOut(omit = []){
    stateFn().forEach(([key, defaultValue]) => {
      this[key] = omit.includes(key) ? this[key] : defaultValue;
    })
  } 
});
