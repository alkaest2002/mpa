import css from "../../cssClasses.json";
import useNavigation from "../../use/useNavigation";

const { goToCurrentQuestionnaire } = useNavigation();

export default () => ({

  initBattery() {
    this.$store.app.currentView = "battery";
    this.$store.session.data.batteries[this.$store.session.batteryId] = 
      { ...this.$store.session.battery, batteryOrder: this.$store.session.completedBatteries.length };
    this.$store.session.questionnaireId = 
      Object.values(this.$store.session.questionnaires)
        .sort((a,b) => Number(a.questionnaireOrder) - Number(b.questionnaireOrder))
        .filter(({ questionnaireId }) => !this.$store.session.completedQuestionnaires.includes(questionnaireId))
        [0]?.questionnaireId;
  },

  showDot(questionnaireId) {
    return {
      [":class"]() {
        const conditionBlue = this.$store.session.getQuestionnaireIsComplete(questionnaireId);
        const conditionOrange = this.$store.session.getQuestionnaireIsRunning(questionnaireId);
        return conditionBlue
          ? css.blueDot
          : conditionOrange
            ? css.orangeDot
            : css.grayDot;
      },
    };
  },

  selectQuestionnaireButton(questionnaireId) {
    return {
      ["@click.prevent"]() {
        this.$store.session.questionnaireId = questionnaireId;
      },
      [":class"]() {
        return questionnaireId == this.$store.session.questionnaireId
          ? css.selected
          : css.nonSelected;
      },
    };
  },

  goToQuestionnaireButton: {
    ["@click.prevent"]() {
      this.$store.session.questionnaireId && goToCurrentQuestionnaire.call(this);
    },
    [":class"]() {
      return this.$store.session.questionnaireId
        ? css.enabledButton
        : css.disabledButton;
    },
  },
});
