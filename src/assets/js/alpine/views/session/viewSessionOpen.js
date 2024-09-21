import css from "../../cssClasses.json";
import useNagigation from "../../use/useNavigation";

const { goToCurrentBattery } = useNagigation();

export default () => ({

  initSessionOpen() {
    this.$store.app.currentView = "session-open";
  },

  openSessionButton: {
    ["@click.prevent"]() {
      this.$store.testee.testeeDataIsSet && goToCurrentBattery.call(this);
    },
    [":class"]() {
      return this.$store.testee.testeeDataIsSet ? css.enabledButton : css.disabledButton;
    },
  }
});
