import useNavigation from "../../use/useNavigation";

const { goToCurrentQuestionnaire } = useNavigation();

export default () => ({

  initQuestionnaireIncomplte() {
    this.$store.app.currentView = "questionnaire-incomplete";
  },

  questionnaireIsIncompleteButton: {
    ["@click.prevent"]() {
      goToCurrentQuestionnaire.call(this);
    },
  },
})