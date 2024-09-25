import useNavigation from "../../use/useNavigation";

const { goToCurrentQuestionnaire } = useNavigation();

export default () => ({

  initQuestionnaireIncomplete() {
    this.$store.app.currentView = "questionnaire-incomplete";
  },

  questionnaireIsIncompleteButton: {
    ["@click.prevent"]() {
      goToCurrentQuestionnaire.call(this);
    },
  },
})