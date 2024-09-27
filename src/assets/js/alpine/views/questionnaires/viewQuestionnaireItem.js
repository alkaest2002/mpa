import css from "../../cssClasses.json";
import useNavigation from "../../use/useNavigation";

const { goToUrl, goToUrlRaw } = useNavigation();

export default () => ({
  
  epoch: Date.now(),
  cumulatedEpoch: 0,
  noResponse: false,

  initQuestionnaireItem(itemId, urlItem) {
    this.$store.app.currentView = "questionnaire-item-single";
    this.$store.session.itemId = itemId;
    this.$store.urls.urlItem = urlItem;
    this.noResponse = this.$store.session.currentAnswerValue?.length === 0;
    this.cumulatedEpoch = this.$store.session.currentAnswer?.answerLatency || 0;
  },

  itemTitle: {
    [":x-text"]() {
      this.$refs["title"].innerText = this.$refs["title"].dataset.title;
    }
  },

  itemOption: (answerData) => {
    return {
      ["@click.prevent"]() {
        const c1 = this.$store.session.currentAnswerValue?.length === 0 && answerData.answerValue?.length === 0;
        const c2 = JSON.stringify(this.$store.session.currentAnswerValue) === JSON.stringify(answerData.answerValue);
        if (c1 || c2) {
          this.$store.session.deleteAnswer(this.$store.session.itemId);
          this.actionType === "mouse" && (this.tabIndex = -1);
        } else {
          this.$store.session.setAnswer({ 
            ...answerData, 
            answerLatency: this.cumulatedEpoch + (Date.now() - this.epoch),
          });
          this.actionType === "mouse" && (this.tabIndex = this.getElementIndex(this.$el));
        }
        this.$nextTick(() => {
          this.noResponse = this.$store.session.currentAnswerValue?.length === 0;
        });
      },
      [":class"]() {
        return answerData.answerValue.some((el) => (this.$store.session.currentAnswerValue || []).includes(el)) 
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
