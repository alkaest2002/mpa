import useTutorial from "../../use/useTutorial";

export default () => ({

  ...useTutorial(),

  initTutorial() {
    this.$store.app.currentView = "tutorial";
  },

  getShouldGoNext() {
    return true;
  },
  
});
