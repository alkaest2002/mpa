import css from "../../cssClasses.json";
import useNavigation from "../../use/useNavigation";

const { goToUrl, goToUrlRaw } = useNavigation();

export default () => ({
  
  itemId: null,
  order: null,
  noResponse: false,
  currentAnswerValue: null,
  answerValues: [],
  epoch: Date.now(),
  cumulatedEpoch: 0,

  get shouldGoNext() {
    return this.$store.session.currentAnswerValue?.length > 0 || this.noResponse;
  },

  initQuestionnaireItemMultiple({ itemId, urlItem, order }) {
    this.$store.session.itemId = itemId;
    this.$store.urls.urlItem = urlItem;
    this.itemId = itemId;
    this.order = order;
    this.noResponse = this.$store.session.currentAnswerValue?.length == 0;
    this.answerValues = this.$store.session.currentAnswerValue || [];
    this.cumulatedEpoch = this.$store.session.currentAnswer?.answerLatency || 0;
    this.$store.app.currentView = "questionnaire-item-multiple";
    this.$watch("noResponse", (val) => {
      val && this.setAnswer({ answerValue: [] });
      val && (this.answerValues = []);
      val && (this.currentAnswerValue = null);
      !val && this.$store.session.deleteAnswer(this.$store.session.itemId);
    });
  },

  setAnswer({ answerValue }) {
    const answerLatency = this.cumulatedEpoch + (Date.now() - this.epoch);
    const c1 = this.$store.session.currentAnswerValue?.length === 0 && answerValue.length === 0;
    const c2 = JSON.stringify(this.answerValues) === JSON.stringify(answerValue);
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
          itemId: this.itemId, order: this.order, answerValue: this.answerValues, answerLatency 
        })
      );
      this.actionType === "mouse" && (this.tabIndex = this.getElementIndex(this.$el));
      this.$nextTick(() => this.noResponse = this.$store.session.currentAnswerValue?.length === 0);
    }
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
        this.noResponse = !answerValue.length > 0
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
  },

  itemNextButton(url) {
    return {
      ["@click.prevent"]() {
        this.shouldGoNext && goToUrlRaw.call(this, url);
      },
      [":class"]() {
        return this.shouldGoNext ? css.enabledButton : css.disabledButton;
      },
    };
  },

  itemTitle: {
    [":x-text"]() {
      this.$refs["title"].innerText = this.$refs["title"].dataset.title;
    }
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
  }
});
