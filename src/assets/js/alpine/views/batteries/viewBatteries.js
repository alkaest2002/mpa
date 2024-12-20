import css from "../../cssClasses.json";
import useNavigation from "../../use/useNavigation";

const { goToUrl } = useNavigation();

export default () => ({
  
  initBatteries(viewName = "batteries") {
    this.$store.app.currentView = viewName;
  },

  selectBatteryButton(batteryId, batteryName, urlBatteryJSON) {
    return {
      async ["@click.prevent"]() {
        const { questionnaires, answerTypes } = await fetch(urlBatteryJSON).then((res) => res.json());
        this.$store.session.batteryId = batteryId;
        this.$store.session.battery = {
          batteryId, 
          batteryName, 
          questionnaires,
          answerTypes
        };
        this.$store.session.questionnaires = questionnaires;
      },
      [":class"]() {
        return batteryId == this.$store.session.batteryId
          ? css.selected
          : css.nonSelected;
      },
    };
  },

  showDot(batteryId) {
    return {
      [":class"]() {
        const conditionBlue = this.$store.session.getBatteryIsComplete(batteryId);
        const conditionOrange = this.$store.session.getBatteryIsRunning(batteryId);
        return conditionBlue
          ? css.blueDot
          : conditionOrange
            ? css.orangeDot
            : css.grayDot;
      },
    };
  },

  goHomeButton: {
    ["@click.prevent"]() {
      this.$store.session.batteryId && goToUrl.call(this, [ "base" ]);
    },
    [":class"]() {
      return this.$store.session.batteryId
        ? css.enabledButton
        : css.disabledButton;
    },
  },
});
