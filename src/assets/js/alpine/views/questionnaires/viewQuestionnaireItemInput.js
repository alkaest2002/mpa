import useQuestionnaireItem from "../../use/useQuestionnaireItem";

export default () => ({

  ...useQuestionnaireItem(),

  currentAnswerValue: null,

  initQuestionnaireItemInput({ itemId, itemUrl }) {
    this.$store.app.currentView = "questionnaire-item-input";
    this.initQuestionnaireItemBase({ itemId, itemUrl });
    this.currentAnswerValue = this.$store.session.currentAnswerValue;
    this.$watch("currentAnswerValue", val => {
      this.setAnswer({ answerValue: val.trim() });
      val.length > 0 && (this.noResponse = false);  
    });
    this.$watch("noResponse", (val) => {
      if (val) {
        this.tabIndex = this.tabElements.length -1;
        this.currentAnswerValue = [];
      } else {
        this.currentAnswerValue?.length === 0 
          && this.$store.session.deleteAnswer(this.$store.session.itemId);
      }
    });
    this.$refs["text-area"].focus();
  },

  setAnswer({ answerValue }) {
    if (answerValue === "")
      return this.$store.session.deleteAnswer(this.$store.session.itemId);
    const answerLatency = this.cumulatedEpoch + (Date.now() - this.epoch);
    this.$store.session.setAnswer(
      Object.assign({}, { 
        itemId: this.$store.session.itemId, 
        answerValue: Array.isArray(answerValue) ? answerValue : [ answerValue ], 
        answerLatency }
      )
    );
  }
});
