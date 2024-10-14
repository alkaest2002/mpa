import css from "../../cssClasses.json";
import useQuestionnaireItem from "../../use/useQuestionnaireItem";

export default () => ({

  ...useQuestionnaireItem(),

  currentAnswerValue: null,
  answerValues: [],
  
  initQuestionnaireItemMultiple({ itemId, itemUrl }) {
    this.$store.app.currentView = "questionnaire-item-multiple";
    this.initQuestionnaireItemBase({ itemId, itemUrl });
    this.answerValues = this.$store.session.currentAnswerValue || [];
    this.$watch("noResponse", (val) => {
      if (val) {
        this.tabIndex = this.tabElements.length -1;
        this.setAnswer({ answerValue: [] });
        this.answerValues = [];
        this.currentAnswerValue = null;
      } else {
        this.$store.session.deleteAnswer(this.$store.session.itemId);
      }
    });
  },

  setAnswer({ answerValue }) {
    const answerLatency = this.cumulatedEpoch + (Date.now() - this.epoch);
    // use clicks no-response while no-response is already true
    const c1 = this.$store.session.currentAnswerValue?.length === 0 && answerValue.length === 0;
    // use clicks option while option is already true and it is the only previously selected value
    const c2 = this.answerValues.length > 0 && JSON.stringify(this.answerValues) === JSON.stringify(answerValue);
    if (c1 || c2) {
      this.$store.session.deleteAnswer(this.$store.session.itemId);
      this.answerValues = [];
    } else {
      this.answerValues = answerValue.length === 0
        ? []
        : this.answerValues.includes(answerValue[0])
          ? this.answerValues.filter((el) => el != answerValue[0])
          : [ ...this.answerValues, ...answerValue ];
      this.$store.session.setAnswer(
        Object.assign({}, { 
          itemId: this.$store.session.itemId, answerValue: this.answerValues.sort(), answerLatency 
        })
      );
    }
    this.noResponse = this.$store.session.currentAnswerValue?.length === 0;
  },

  itemOption({ answerValue }) {
    return {
      ["@keyup.window"]({ keyCode }) {
        keyCode === 32 // spacebar
          && JSON.stringify(this.currentAnswerValue) === JSON.stringify(answerValue) 
          && this.setAnswer({ answerValue });
      },
      ["@click.prevent"]() {
        this.tabIndex = this.getElementIndex(this.$el);
        this.currentAnswerValue = answerValue;
        this.noResponse = !answerValue.length > 0;
        answerValue.length === 0 && this.actionType === "keyboard" && this.setAnswer({ answerValue });
        this.actionType === "mouse" && this.setAnswer({ answerValue });
      },
      [":class"]() {
        return {
          ...(() => answerValue.some((el) => (this.currentAnswerValue || []).includes(el))
            ? css.selectedWithRing
            : {}
          )(),
          ...(() => answerValue.some((el) => this.answerValues.includes(el))
            ? css.selected
            : css.nonSelected
          )()
        }
      },
    };
  }
});
