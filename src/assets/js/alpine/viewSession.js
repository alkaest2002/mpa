import css from "./cssClasses.json";
import useNagigation from "./useNavigation";
import useValidation from "./useValidation";
import useData from "./useData";

const { goToUrl, goToCurrentBattery } = useNagigation();
const { validateData } = useValidation();
const { getDataToExport, getExportFileName, downloadJSON, downloadZip } = useData();

export default () => ({
  file: null,
  fileAsText: null,
  dataToExport: null,
  exportFileName: null,

  initSession() {
    this.$store.app.currentView = "session";
    Alpine.effect(() => {
      this.dataToExport = getDataToExport.bind(this)();
      this.exportFileName = getExportFileName.bind(this)();
    });
  },

  get uploadedFilename() {
    return this.file?.name;
  },
  
  uploadFile: {
    ["@change.prevent"]({ target: { files } }) {
        const reader = new FileReader();
        const filesList = Array.from(files || []);
        const file = filesList.find((f) => f.type == "application/json");
        if (file) {
          this.file = file;
          reader.readAsText(file);
          reader.onload = () => { this.fileAsText = reader.result };
          reader.onerror = () => { goToUrl.bind(this)([ "notifications", "io-error" ]) };
        }
    },
  },

  resetSession() {
    this.$store.app.wipeOut();
    this.$store.testee.wipeOut();
    this.$store.session.wipeOut([ "settingId" ]);
    this.$store.urls.wipeOut([ "urlReports" ]);
    goToUrl.bind(this)([ "base" ]);
  },

  openSessionButton: {
    ["@click.prevent"]() {
      this.$store.testee.testeeDataIsSet && goToCurrentBattery.bind(this)();
    },
    [":class"]() {
      return this.$store.testee.testeeDataIsSet ? css.enabledButton : css.disabledButton;
    },
  },

  closeSessionButton: {
    ["@click.prevent"]() {
      if (this.dataToExport) {
        downloadZip(this.dataToExport, this.exportFileName);
        this.resetSession();
      }
    },
    [":class"]() {
      return this.dataToExport ? css.enabledButton : css.disabledButton;
    },
  },

  pauseSessionButton: {
    ["@click.prevent"]() {
      downloadJSON(this.dataToExport, this.exportFileName);
      this.resetSession();
    },
    [":class"]() {
      return this.$store.testee.testeeDataIsSet ? css.enabledButton : css.disabledButton;
    },
  },

  resumeSessionButton: {
    ["@click.prevent"]() {
        const dataJSON = validateData(this.fileAsText);
        if (!dataJSON) return goToUrl.bind(this)([ "notifications", "errors", "error-resuming-session" ]);
        this.$store.session.importData(dataJSON);
        this.$store.testee.importData(dataJSON);
        this.$store.urls.importData(dataJSON);
        goToUrl.bind(this)([ "session", "open-session" ]);
    },
    [":class"]() {
      return this.file ? css.enabledButton : css.disabledButton;
    },
  }
});
