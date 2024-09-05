export default (Alpine) => ({
  
  currentView: Alpine.$persist("").using(sessionStorage),
  tutorialSwitch: Alpine.$persist("on").using(sessionStorage),
  autoPilotSwitch: Alpine.$persist("on").using(sessionStorage),
  burgerIsOpen: Alpine.$persist(false).using(sessionStorage),

  wipeOut() {
    this.currentView = "";
    this.tutorialSwitch = "on";
    this.autoPilotSwitch = "on";
    this.burgerIsOpen = false;
  }
});
