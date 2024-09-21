import css from "../../cssClasses.json";
import useNavigation from "../../use/useNavigation";

const { goToUrl, goToUrlRaw } = useNavigation();

export default () => ({
  epoch: Date.now(),
  cumulatedEpoch: 0,
  noResponse: false,

  initQuestionnaireItem(itemId, urlItem) {
    this.$store.app.currentView = "questionnaire-item";
    this.$store.session.itemId = itemId;
    this.$store.urls.urlItem = urlItem;
    this.noResponse = this.$store.session.currentAnswerValue === "";
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
        if (this.$store.session.currentAnswerValue === "" && answerData.answerValue === "") {
          this.deleteAnswer();
        } else {
          this.setAnswer({ 
            ...answerData, 
            answerLatency: this.cumulatedEpoch + (Date.now() - this.epoch),
          });
        }
        this.$nextTick(() => {
          this.noResponse = this.$store.session.currentAnswerValue === "";
        })
      },
      [":class"]() {
        return this.$store.session.currentAnswerValue === answerData.answerValue
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

  setAnswer(answerData) {
    this.$store.session.setAnswer(answerData);
  },

  deleteAnswer() {
    this.$store.session.deleteAnswer(this.$store.session.itemId);
  },

  get shouldGoNext() {
    const val = this.$store.session.currentAnswerValue;
    return (typeof val === "number" && Number.isFinite(val)) || this.noResponse;
  },
});