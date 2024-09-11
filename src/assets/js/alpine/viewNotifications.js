import css from "./cssClasses.json";
import useNavigation from "./useNavigation";
import useData from "./useData";

const { goToCurrentBattery, goToCurrentQuestionnaire, goToUrl } = useNavigation();
const { downloadZip } = useData();

export default () => ({

  initNotifications() {
    this.$store.app.currentView = "notifications";
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
  },

  questionnaireIsIncompleteButton: {
    ["@click.prevent"]() {
      goToCurrentQuestionnaire.call(this);
    },
  },

  batteryIsCompleteButton: {
    ["@click.prevent"]() {
      if (this.$store.app.autoPilotSwitch == "on") {
        downloadZip.call(this);
        this.$store.testee.wipeState();
        this.$store.session.wipeState([ "settingId", "batteryId", "battery", "questionnaires", "languageId" ]);
        this.$store.reports.wipeState();
        this.$store.app.wipeState();
      }
      goToUrl.call(this, [ "base" ]);
    },
  },
})