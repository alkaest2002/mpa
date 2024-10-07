import css from "../../cssClasses.json";
import useNagigation from "../../use/useNavigation";

const { goToUrlRaw } = useNagigation();

export default () => ({

  initQuestionnaireMap() {
    this.$store.app.currentView = "questionnaire-map";
2  },

  itemMapButton(itemId, urlItem) {
    return {
      ["@click.prevent"]() {
        if (this.$store.session.getAnswer(itemId)) {
          this.$store.session.itemId = itemId;
          this.$store.urls.urlItem = urlItem;
        }
      },
      [":class"]() {
        if (this.$store.session.getAnswer(itemId)) {
          return this.$store.session.itemId === itemId
            ? css.selected
            : css.nonSelected;
        } else {
          return css.nonSelectable
        }
      }
    };
  },

  answerWasOmittedLabel(itemId) {
    return {
      [":class"]() {
        return this.$store.session.getAnswerValue(itemId) === ""
          ? css.display.inline
          : css.display.hidden;
      }
    }
  },

  answerWasGivenLabel(itemId) {
    return {
      [":class"]() {
        return this.$store.session.getAnswerValue(itemId) !== ""
          ? css.display.inline
          : css.display.hidden;
      }
    }
  },

  showDot(itemId) {
    return {
      [":class"]() {
        if (!this.$store.session.getAnswer(itemId)) return css.grayDot;
        return this.$store.session.getAnswerValue(itemId) !== ""
          ? css.blueDot
          : css.orangeDot;
      }
    }
  },

  goToItemButton: {
    ["@click.prevent"]() {
      this.$store.session.currentAnswer && goToUrlRaw.call(this, this.$store.urls.urlItem);
    },
    [":class"]() {
      return this.$store.session.currentAnswer 
        ? css.enabledButton
        : css.disabledButton
    },
  },
});
