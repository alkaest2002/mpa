import css from "../../cssClasses.json";
import viewTutorialItemBase from "./viewTutorialItemBase";

export default () => ({

  ...viewTutorialItemBase(),
  
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
