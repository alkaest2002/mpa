import css from "../../cssClasses.json";
import useTutorial from "../../use/useTutorial";

export default () => ({

  ...useTutorial(),
  
  initTutorialItemSingle() {
    this.$store.app.currentView = "tutorial-item-single";
    this.$store.app.tutorialSwitch = "on";
  },

  getShouldGoNext() {
    return this.answer == 4;
  },

  fakeItem(answer) {
    return {
      ["@click.prevent"]() {
        this.answer = answer;
      },
      [":class"]() {
        return answer == this.answer
          ? css.selected
          : css.nonSelected
      }
    }
  }
});
