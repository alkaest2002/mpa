import css from "./cssClasses.json";
import useNavigation from "./useNavigation";

const { goToUrl } = useNavigation();

export default () => ({

  
  initBatteries() {
    this.$store.app.currentView = "batteries";
  },

  selectBatteryButton(batteryId, batteryName, urlBatteryJSON) {
    return {
      async ["@click"]() {
        const { questionnaires } = await fetch(urlBatteryJSON).then((res) => res.json());
        this.$store.session.batteryId = batteryId;
        this.$store.session.battery = {
          order: this.$store.session.completedBatteries.length,
          batteryId, 
          batteryName, 
          questionnaires 
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
    ["@click"]() {
      this.$store.session.batteryId && goToUrl.bind(this)([ "base" ]);
    },
    [":class"]() {
      return this.$store.session.batteryId
        ? css.enabledButton
        : css.disabledButton;
    },
  },
});
