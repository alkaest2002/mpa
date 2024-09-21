import css from "../../cssClasses.json";
import useNagigation from "../../use/useNavigation";
import useSessionData from "../../use/useSessionData";

const { goToUrl } = useNagigation();
const { downloadJSON } = useSessionData();

export default () => ({

  initSessionPause() {
    this.$store.app.currentView = "session-pause";
  },

  pauseSessionButton: {
    ["@click.prevent"]() {
      if (this.$store.testee.testeeDataIsSet) {
        downloadJSON.call(this);
        this.$store.app.wipeState();
        this.$store.testee.wipeState();
        this.$store.session.wipeState([ "settingId" ]);
        this.$store.urls.wipeState([ "urlBase", "urlReports" ]);
        goToUrl.call(this, [ "base" ]);
      };
    },
    [":class"]() {
      return this.$store.testee.testeeDataIsSet 
        ? css.enabledButton : css.disabledButton;
    },
  },
});
