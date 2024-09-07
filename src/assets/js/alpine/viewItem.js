import css from "./cssClasses.json";
import useNavigation from "./useNavigation";

const { goToUrl, goToUrlRaw } = useNavigation();

export default () => ({
  epochIn: 0,
  noResponse: false,

  initItem(itemId, urlItem) {
    this.epochIn = Date.now();
    this.$store.app.currentView = "item";
    this.$store.session.itemId = itemId;
    this.$store.urls.urlItem = urlItem;
    this.noResponse = this.$store.session.currentAnswerValue == "";
  },

  itemTitle: {
    [":x-text"]() {
      const $el = this.$refs["title"];
      const { title, itemNo, itemsNo } = $el.dataset;
      const pagination = `(${itemNo}/${itemsNo})`; 
      $el.innerText = `${title} ${pagination}`;
    }
  },

  itemOption: (answerData) => {
    return {
      ["@click"]() {
        const elapsedTime = (Date.now() - this.epochIn);
        const currentAnswerLatency = this.$store.session.currentAnswer?.answerLatency;
        const answerLatency = this.$store.session.currentAnswerValue == answerData.answerValue
          ? currentAnswerLatency
          : (currentAnswerLatency || 0) + elapsedTime;
        this.setAnswerData({ ...answerData, answerLatency });
        this.$nextTick(() => {
          !this.noResponse && this.$store.session.currentAnswerValue == "" && this.deleteAnswer();
          this.noResponse = this.$store.session.currentAnswerValue == "";
        })
      },
      [":class"]() {
        return this.$store.session.currentAnswerValue == answerData.answerValue
          ? css.selected
          : css.nonSelected;
      },
    };
  },

  itemNextButton: (url) => {
    return {
      ["@click"]() {
        this.shouldGoNext && goToUrlRaw.bind(this)(url);
      },
      [":class"]() {
        return this.shouldGoNext ? css.enabledButton : css.disabledButton;
      },
    };
  },

  itemEndButton: {
    ["@click"]() {
      if (!this.shouldGoNext) return
      if (!this.$store.session.currentQuestionnaireIsComplete) {
        return goToUrl.bind(this)([ "notifications", "questionnaire-incomplete" ]);
      }
      this.$store.session.addCurrentQuestionnaireToCompletedList();
      if (this.$store.session.currentBatteryIsComplete) {
        this.$store.session.addCurrentBatteryToCompletedList();
        return goToUrl.bind(this)([ "notifications", "battery-complete" ]);
      }
      goToUrl.bind(this)([ "notifications", "questionnaire-complete" ]);
      
    },
    [":class"]() {
      return this.shouldGoNext ? css.enabledButton : css.disabledButton;
    },
  },

  setAnswerData(answerData) {
    this.$store.session.setAnswerData(answerData);
  },

  deleteAnswer() {
    this.$store.session.deleteAnswer(this.$store.session.itemId);
  },

  get shouldGoNext() {
    return this.$store.session.currentAnswerValue || this.noResponse;
  },
});
