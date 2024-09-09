import css from "./cssClasses.json";
import useNavigation from "./useNavigation";
import useData from "./useData";

const { goToCurrentBattery, goToCurrentQuestionnaire, goToUrl } = useNavigation();
const { getDataToExport, getExportFileName, downloadZip } = useData();

export default () => ({
  dataToExport: null,
  exportFileName: null,

  initNotifications() {
    this.$store.app.currentView = "notifications";
    Alpine.effect(() => {
      this.dataToExport = getDataToExport.call(this);
      this.exportFileName = getExportFileName.call(this);
    });
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
      if (this.$store.app.autoPilotSwitch == "on" && this.dataToExport) {
        downloadZip(this.dataToExport, this.exportFileName);
        this.$store.testee.wipeState();
        this.$store.session.wipeState([ "settingId", "batteryId", "battery", "questionnaires", "languageId" ]);
        this.$store.app.wipeState();
      }
      goToUrl.call(this, [ "base" ]);
    },
  },
})