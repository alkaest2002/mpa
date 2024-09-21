import css from "../../cssClasses.json";
import useNagigation from "../../use/useNavigation";
import useValidation from "../../use/useValidation";

const { validateData } = useValidation();
const { goToUrl } = useNagigation();

export default () => ({
  file: null,
  fileAsText: null,

  initSessionResume() {
    this.$store.app.currentView = "session-resume";
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

  resumeSessionButton: {
    ["@click.prevent"]() {
        const dataJSON = validateData(this.fileAsText);
        if (!dataJSON) return goToUrl.call(this, [ "notifications", "errors", "error-resuming-session" ]);
        this.$store.session.importState(dataJSON);
        this.$store.testee.importState(dataJSON);
        this.$store.urls.importState(dataJSON);
        goToUrl.call(this, [ "session", "session-open" ]);
    },
    [":class"]() {
      return this.file ? css.enabledButton : css.disabledButton;
    },
  }
});
