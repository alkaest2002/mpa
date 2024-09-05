import css from "./cssClasses.json";
import useNavigation from "./useNavigation";

const { goToUrlRaw } = useNavigation();

export default () => ({
  
  fakeItemId: null,
  
  initTutorial(tutorialSwitch = "on") {
    this.$store.app.currentView = "tutorial";
    this.$store.app.tutorialSwitch = tutorialSwitch;
  },

  get shouldGoNext() {
    return this.fakeItemId == 4;
  },

  fakeItem(fakeItemId) {
    return {
      ["@click.prevent"]() {
        this.fakeItemId = fakeItemId;
      },
      [":class"]() {
        return fakeItemId == this.fakeItemId
          ? css.selected
          : css.nonSelected
      }
    }
  },

  nextRight() {
    return {
      ["@click.prevent"]() {
        this.fakeItemId = Math.min(4, this.fakeItemId +1);
      },
    }
  },

  previousLeft() {
    return {
      ["@click.prevent"]() {
        this.fakeItemId = Math.max(0, this.fakeItemId -1);
      },
    }
  },

  goToNextTutorialButton(url) {
    return {
      ["@click.prevent"]() {
        this.shouldGoNext && goToUrlRaw.bind(this)(url);
      },
      [":class"]() {
        return this.shouldGoNext
          ? css.enabledButton
          : css.disabledButton
      }
    };
  },
});
