import css from "../../cssClasses.json";
import useTutorial from "../../use/useTutorial";

export default () => ({

  ...useTutorial(),
  
  currentAnswer: null,
  
  initTutorialItemMultiple() {
    this.answer = [];
    this.$store.app.currentView = "tutorial-item-multiple";
    this.$store.app.tutorialSwitch = "on";
  },

  getShouldGoNext() {
    return JSON.stringify(this.answer.sort()) === JSON.stringify([1, 3]);
  },

  setAnswer(answer) {
    const c1 = this.currentAnswer?.length === 0 && answer.length === 0;
    const c2 = this.answer?.length > 0 && JSON.stringify(this.answer) === JSON.stringify(answer);
    if (c1 || c2) {
      this.currentAnswer = null;
      this.answer = [];
    } else {
      this.answer = this.answer.includes(answer[0])
        ? this.answer.filter((el) => el != answer[0])
        : [ ...this.answer, ...answer ];
    }
  },

  fakeItem(answer) {
    return {
      ["@keyup.window"]({ keyCode }) {
        keyCode === 32
          && JSON.stringify(this.currentAnswer) === JSON.stringify(answer) 
          && this.setAnswer(answer);
      },
      ["@click.prevent"]() {
        this.tabIndex = this.getElementIndex(this.$el);
        this.currentAnswer = answer;
        this.actionType === "mouse" && this.setAnswer(answer);
      },
      [":class"]() {
        return {
          ...(() => answer.some((el) => (this.currentAnswer || []).includes(el))
            ? css.selectedWithRing
            : {}
          )(),
          ...(() => answer.some((el) => this.answer.includes(el))
            ? css.selected
            : css.nonSelected
          )()
        }
      },
    }
  },
});
