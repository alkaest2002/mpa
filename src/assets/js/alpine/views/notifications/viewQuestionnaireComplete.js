import css from "../../cssClasses.json";
import useNavigation from "../../use/useNavigation";

const { goToCurrentBattery } = useNavigation();

export default () => ({

  initQuestionnaireComplete() {
    this.$store.app.currentView = "questionnaire-complete";
  },

  questionnaireIsCompleteButton() {
    return {
      ["@click.prevent"]() {
        this.$store.session.completedQuestionnaires.includes(this.$store.session.questionnaireId) 
          && goToCurrentBattery.call(this);
      },
      [":class"]() {
        return this.$store.session.completedQuestionnaires.includes(this.$store.session.questionnaireId)
          ? css.selected
          : css.nonSelected;
      },
    }
  }
})