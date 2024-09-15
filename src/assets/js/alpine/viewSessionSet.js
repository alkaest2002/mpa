import css from "./cssClasses.json";
import useNagigation from "./useNavigation";

const { goToUrl } = useNagigation();

export default () => ({
  initSessionSet(urlReports) {
    this.$store.app.currentView = "session-set";
    this.$store.urls.urlReports = urlReports;
    // force report regeneration under following circumstaces
    this.$watch("$store.session.settingId", () => {
      this.$store.session.completedQuestionnaires = [ ...this.$store.session.completedQuestionnaires ];
    });
    this.$watch("$store.urls.urlReports", () => {
      this.$store.session.completedQuestionnaires = [ ...this.$store.session.completedQuestionnaires ];
    });
  },
  
  setSessionButton: {
    ["@click.prevent"]() {
      this.$store.urls.urlReports && this.$store.session.settingId && goToUrl.call(this, [ "batteries" ]);
    },
    [":class"]() {
      return this.$store.urls.urlReports && this.$store.session.settingId
        ? css.enabledButton
        : css.disabledButton;
    },
  },
});
