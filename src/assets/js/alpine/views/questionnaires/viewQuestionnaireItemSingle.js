import css from "../../cssClasses.json";
import useQuestionnaireItemBase from "../../use/useQuestionnaireItemBase";

export default () => ({

  ...useQuestionnaireItemBase(),
  
  initQuestionnaireItemSingle({ itemId, itemUrl }) {
    this.$store.app.currentView = "questionnaire-item-single";
    this.$store.session.itemId = itemId;
    this.$store.urls.urlItem = itemUrl;
    this.noResponse = this.$store.session.currentAnswerValue?.length === 0;
    this.cumulatedEpoch = this.$store.session.currentAnswer?.answerLatency || 0;
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
