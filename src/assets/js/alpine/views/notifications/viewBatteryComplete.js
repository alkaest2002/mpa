import css from "../../cssClasses.json";
import useNavigation from "../../use/useNavigation";
import useSessionData from "../../use/useSessionData";

const { goToUrl } = useNavigation();
const { downloadZip } = useSessionData();

export default () => ({

  initBatteryComplete() {
    this.$store.app.currentView = "battery-complete";
  },

  batteryIsCompleteButton: {
    ["@click.prevent"]() {
      if (this.$store.app.autoPilotSwitch == "on" && !this.$store.reports.generatingReports) {
        downloadZip.call(this);
        //this.$store.app.wipeState();
        //this.$store.reports.wipeState();
        //this.$store.testee.wipeState();
        //this.$store.session.wipeState([ 
        //  "settingId", "batteryId", "battery", "questionnaires", "languageId" 
        //]);
      }
      goToUrl.call(this, [ "base" ]);
    },
    [":class"]() {
      return this.$store.reports.generatingReports
        ? css.disabledButton
        : css.enabledButton;
    },
  },
})