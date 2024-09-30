import css from "../cssClasses.json";
import useNavigation from "./useNavigation";

const { goToUrl, goToUrlRaw } = useNavigation();

export default () => ({
  
  epoch: Date.now(),
  cumulatedEpoch: 0,
  noResponse: false,

  getShouldGoNext() {
    return this.$store.session.currentAnswerValue?.length > 0 || this.noResponse;
  },

  itemNextButton(url) {
    return {
      ["@click.prevent"]() {
        this.getShouldGoNext() && goToUrlRaw.call(this, url);
      },
      [":class"]() {
        return this.getShouldGoNext() ? css.enabledButton : css.disabledButton;
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
      if (!this.getShouldGoNext()) return
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
      return this.getShouldGoNext() ? css.enabledButton : css.disabledButton;
    },
  }
});
