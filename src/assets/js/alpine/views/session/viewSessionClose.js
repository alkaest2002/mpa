import css from "../../cssClasses.json";
import useNagigation from "../../use/useNavigation";
import useSessionData from "../../use/useSessionData";

const { goToUrl } = useNagigation();
const { downloadZip } = useSessionData();

export default () => ({

  initSessionClose() {
    this.$store.app.currentView = "session-close";
  },

  closeSessionButton: {
    ["@click.prevent"]() {
      if (!this.$store.reports.generatingReports) {
        downloadZip.call(this);
        this.$store.app.wipeState();
        this.$store.testee.wipeState();
        this.$store.session.wipeState([ "settingId" ]);
        this.$store.urls.wipeState([ "urlBase", "urlReports" ]);
        goToUrl.call(this, [ "base" ]);
      }
    },
    [":class"]() {
      return !this.$store.reports.generatingReports
        ? css.enabledButton : css.disabledButton;
    },
  }
});
