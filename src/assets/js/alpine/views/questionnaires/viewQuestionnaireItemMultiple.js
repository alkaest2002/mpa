import css from "../../cssClasses.json";
import useNavigation from "../../use/useNavigation";

const { goToUrl, goToUrlRaw } = useNavigation();

export default () => ({
  epoch: Date.now(),
  cumulatedEpoch: 0,
  noResponse: false,
  currentAnswerValue: null,
  answerValues: [],

  initQuestionnaireItemMultiple(itemId, urlItem) {
    this.$store.app.currentView = "questionnaire-item-multiple";
    this.$store.session.itemId = itemId;
    this.$store.urls.urlItem = urlItem;
    this.noResponse = this.$store.session.currentAnswerValue?.length == 0;
    this.cumulatedEpoch = this.$store.session.currentAnswer?.answerLatency || 0;
    this.answerValues = this.$store.session.currentAnswerValue || [];
  },

  itemTitle: {
    [":x-text"]() {
      this.$refs["title"].innerText = this.$refs["title"].dataset.title;
    }
  },

  setAnswer(answerData) {
    const { itemId, answerValue, order } = answerData;
    const answerLatency = this.cumulatedEpoch + (Date.now() - this.epoch);
    if (this.answerValues.includes(answerValue)) {
      this.answerValues = this.answerValues.filter((el) => el != answerValue);
      this.answerValues.length === 0 && this.$store.session.deleteAnswer(this.$store.session.itemId);
      this.currentAnswerValue = null;
    } else {
      this.answerValues = [ ...this.answerValues, ...answerValue ]
      this.$store.session.setAnswer({ 
        ...Object.assign({}, { itemId, order, answerValue: this.answerValues, answerLatency }),
      }, false);
      this.$nextTick(() => this.noResponse = this.$store.session.currentAnswerValue?.length === 0)
    }
  },

  itemOption: (answerData) => {
    return {
      ["@keyup.window"]({ keyCode }) {
        keyCode === 32
          && this.currentAnswerValue === answerData.answerValue 
          && this.setAnswer(answerData);
      },
      ["@click.prevent"]() {
        if (this.$store.session.currentAnswerValue?.length === 0 && answerData.answerValue?.length === 0) {
          this.$store.session.deleteAnswer(this.$store.session.itemId);
        } else {
          this.currentAnswerValue = answerData.answerValue;
          this.actionType === "mouse" && this.setAnswer(answerData);
          this.actionType === "mouse" && (this.tabIndex = this.getElementIndex(this.$el));
        }
      },
      [":class"]() {
        return [ ...this.answerValues, this.currentAnswerValue ].includes(answerData.answerValue) 
          ? css.selected
          : css.nonSelected;
      },
    };
  },

  itemNextButton: (url) => {
    return {
      ["@click.prevent"]() {
        this.shouldGoNext && goToUrlRaw.call(this, url);
      },
      [":class"]() {
        return this.shouldGoNext ? css.enabledButton : css.disabledButton;
      },
    };
  },

  itemEndButton: {
    ["@click.prevent"]() {
      if (!this.shouldGoNext) return
      if (!this.$store.session.currentQuestionnaireIsComplete) {
        return goToUrl.call(this, [ "notifications", "questionnaire-incomplete" ]);
      } else {
        this.$store.session.addCurrentQuestionnaireToCompletedList();
        this.$store.session.itemId = "";
        this.$store.urls.urlItem = "";
        if (this.$store.session.currentBatteryIsComplete) {
          this.$store.session.addCurrentBatteryToCompletedList();
          return goToUrl.call(this, [ "notifications", "battery-complete" ]);
        }
        goToUrl.call(this, [ "notifications", "questionnaire-complete" ]);
      }
      
    },
    [":class"]() {
      return this.shouldGoNext ? css.enabledButton : css.disabledButton;
    },
  },

  get shouldGoNext() {
    return this.$store.session.currentAnswerValue?.length > 0 || this.noResponse;
  },
});
