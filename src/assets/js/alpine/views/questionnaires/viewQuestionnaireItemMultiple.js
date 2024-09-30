import css from "../../cssClasses.json";
import useQuestionnaireItemBase from "../../use/useQuestionnaireItemBase";

export default () => ({

  ...useQuestionnaireItemBase(),
  currentAnswerValue: null,
  answerValues: [],
  
  initQuestionnaireItemMultiple({ itemId, itemUrl }) {
    this.$store.app.currentView = "questionnaire-item-multiple";
    this.$store.session.itemId = itemId;
    this.$store.urls.urlItem = itemUrl;
    this.noResponse = this.$store.session.currentAnswerValue?.length == 0;
    this.answerValues = this.$store.session.currentAnswerValue || [];
    this.cumulatedEpoch = this.$store.session.currentAnswer?.answerLatency || 0;
    this.$watch("noResponse", (val) => {
      this.tabIndex = this.tabElements.length -1;
      if (val) {
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
    const c1 = this.$store.session.currentAnswerValue?.length === 0 && answerValue.length === 0;
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
          itemId: this.$store.session.itemId, order: this.order, answerValue: this.answerValues, answerLatency 
        })
      );
    }
    this.noResponse = this.$store.session.currentAnswerValue?.length === 0;
  },

  itemOption({ answerValue }) {
    return {
      ["@keyup.window"]({ keyCode }) {
        keyCode === 32
          && JSON.stringify(this.currentAnswerValue) === JSON.stringify(answerValue) 
          && this.setAnswer({ answerValue });
      },
      ["@click.prevent"]() {
        this.currentAnswerValue = answerValue;
        this.noResponse = !answerValue.length > 0;
        answerValue.length === 0 && this.actionType === "keyboard" && this.setAnswer({ answerValue });
        this.actionType === "mouse" && this.setAnswer({ answerValue });
        this.tabIndex = this.getElementIndex(this.$el);
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
