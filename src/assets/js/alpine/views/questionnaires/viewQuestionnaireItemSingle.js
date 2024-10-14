import css from "../../cssClasses.json";
import useQuestionnaireItem from "../../use/useQuestionnaireItem";

export default () => ({

  ...useQuestionnaireItem(),
  
  initQuestionnaireItemSingle({ itemId, itemUrl }) {
    this.$store.app.currentView = "questionnaire-item-single";
    this.initQuestionnaireItemBase({ itemId, itemUrl });
    this.$watch("noResponse", (val) => {
      val && (this.tabIndex = this.tabElements.length -1);
      val && this.setAnswer({ answerValue: [] });
    });
  },

  setAnswer({ answerValue }) {
    const answerLatency = this.cumulatedEpoch + (Date.now() - this.epoch);
    const c1 = this.$store.session.currentAnswerValue?.length === 0 && answerValue.length === 0;
    const c2 = this.$store.session.currentAnswerValue?.length > 0 
      && JSON.stringify(this.$store.session.currentAnswerValue) === JSON.stringify(answerValue);
    if (c1 || c2) {
      this.$store.session.deleteAnswer(this.$store.session.itemId);
      this.tabIndex = -1;
    } else {
      this.$store.session.setAnswer(
        Object.assign({}, { itemId: this.$store.session.itemId, answerValue, answerLatency })
      );
    }
  },

  itemOption(answerData) {
    return {
      ["@click.prevent"]() {
        this.tabIndex = this.getElementIndex(this.$el);
        this.setAnswer(answerData);
        this.noResponse = this.$store.session.currentAnswerValue?.length === 0;
      },
      [":class"]() {
        return answerData.answerValue.some((el) => (this.$store.session.currentAnswerValue || []).includes(el)) 
          ? css.selected
          : css.nonSelected;
      },
    };
  }
});
