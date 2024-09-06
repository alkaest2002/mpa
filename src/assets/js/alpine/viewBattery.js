import css from "./cssClasses.json";
import useNavigation from "./useNavigation";

const { goToCurrentQuestionnaire } = useNavigation();

export default () => ({
  
  initBattery() {
    this.$store.app.currentView = "battery";
    const currentBattery = {
      order: this.$store.session.completedBatteries.length,
      ...this.$store.session.currentBattery 
    };
    this.$store.session.data.batteries[this.$store.session.batteryId] = currentBattery;
    this.$store.session.questionnaireId = 
      Object.values(this.$store.session.questionnaires)
        .map((el, order) => ({ order, ...el }))
        .sort((a,b) => Number(a.order) - Number(b.order))
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
      ["@click"]() {
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
      this.$store.session.questionnaireId && goToCurrentQuestionnaire.bind(this)();
    },
    [":class"]() {
      return this.$store.session.questionnaireId
        ? css.enabledButton
        : css.disabledButton;
    },
  },
});
