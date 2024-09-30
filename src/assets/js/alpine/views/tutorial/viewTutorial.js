import css from "../../cssClasses.json";
import useNavigation from "../../use/useNavigation";

const { goToUrlRaw } = useNavigation();

export default () => ({
  
  fakeItemId: null,
  
  initTutorial(tutorialSwitch = "on") {
    this.$store.app.currentView = "tutorial";
    this.$store.app.tutorialSwitch = tutorialSwitch;
  },

  getShouldGoNext() {
    return this.fakeItemId == 4;
  },

  fakeItem(fakeItemId) {
    return {
      ["@click.prevent"]() {
        this.fakeItemId = fakeItemId;
      },
      [":class"]() {
        return fakeItemId == this.fakeItemId
          ? css.selected
          : css.nonSelected
      }
    }
  },

  goToNextTutorialButton(url) {
    return {
      ["@click.prevent"]() {
        this.getShouldGoNext() && goToUrlRaw.call(this, url);
      },
      [":class"]() {
        return this.getShouldGoNext()
          ? css.enabledButton
          : css.disabledButton
      }
    };
  },
});
