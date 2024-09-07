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
      this.dataToExport = getDataToExport.bind(this)();
      this.exportFileName = getExportFileName.bind(this)();
    });
  },

  questionnaireIsCompleteButton() {
    return {
      ["@click.prevent"]() {
        this.$store.session.completedQuestionnaires.includes(this.$store.session.questionnaireId) 
          && goToCurrentBattery.bind(this)();
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
      goToCurrentQuestionnaire.bind(this)();
    },
  },

  batteryIsCompleteButton: {
    ["@click.prevent"]() {
      console.log(this.$store.app.autoPilotSwitch, this.dataToExport);
      if (this.$store.app.autoPilotSwitch == "on" && this.dataToExport) {
        downloadZip(this.dataToExport, this.exportFileName);
        this.$store.testee.wipeOut();
        this.$store.session.wipeOut([ "settingId", "batteryId", "battery", "questionnaires", "languageId" ]);
        this.$store.app.wipeOut();
      }
      goToUrl.bind(this)([ "base" ]);
    },
  },
})