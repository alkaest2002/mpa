import css from "./cssClasses.json";
import useNagigation from "./useNavigation";
import useValidation from "./useValidation";
import useSessionData from "./useSessionData";

const { validateData } = useValidation();
const { goToUrl, goToCurrentBattery } = useNagigation();
const { downloadJSON, downloadZip } = useSessionData();

export default () => ({
  file: null,
  fileAsText: null,

  initSession(viewName) {
    this.$store.app.currentView = viewName;
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
          reader.onerror = () => { goToUrl.call(this, [ "notifications", "io-error" ]) };
        }
    },
  },

  resetSession() {
    this.$store.app.wipeState();
    this.$store.testee.wipeState();
    this.$store.session.wipeState([ "settingId" ]);
    this.$store.urls.wipeState([ "urlBase", "urlReports" ]);
    goToUrl.call(this, [ "base" ]);
  },

  openSessionButton: {
    ["@click.prevent"]() {
      this.$store.testee.testeeDataIsSet && goToCurrentBattery.call(this);
    },
    [":class"]() {
      return this.$store.testee.testeeDataIsSet ? css.enabledButton : css.disabledButton;
    },
  },

  closeSessionButton: {
    ["@click.prevent"]() {
      if (!this.$store.reports.generatingReports) {
        downloadZip.call(this);
        this.resetSession();
      }
    },
    [":class"]() {
      return !this.$store.reports.generatingReports
        ? css.enabledButton : css.disabledButton;
    },
  },

  pauseSessionButton: {
    ["@click.prevent"]() {
      if (this.$store.testee.testeeDataIsSet) {
        downloadJSON.call(this);
        this.resetSession()
      };
    },
    [":class"]() {
      return this.$store.testee.testeeDataIsSet 
        ? css.enabledButton : css.disabledButton;
    },
  },

  resumeSessionButton: {
    ["@click.prevent"]() {
        const dataJSON = validateData(this.fileAsText);
        if (!dataJSON) return goToUrl.call(this, [ "notifications", "errors", "error-resuming-session" ]);
        this.$store.session.importState(dataJSON);
        this.$store.testee.importState(dataJSON);
        this.$store.urls.importState(dataJSON);
        goToUrl.call(this, [ "session", "open-session" ]);
    },
    [":class"]() {
      return this.file ? css.enabledButton : css.disabledButton;
    },
  }
});
