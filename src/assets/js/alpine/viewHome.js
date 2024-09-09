import css from "./cssClasses.json";
import useNavigation from "./useNavigation";

const { setUrl, goToUrl, goToUrlRaw } = useNavigation();

export default () => ({

  async initHome(languageId, urls) {
    this.$store.app.currentView = "home";
    this.$store.session.languageId = languageId;
    const urlsJSON = await (await fetch(urls)).json();
    setUrl.call(this, urlsJSON);
  },

  setLanguageIdButton: (languageId, urlHomepage) => {
    return {
      ["@click.prevent"]() {
        this.$store.session.languageId = languageId;
        goToUrlRaw.call(this, urlHomepage);
      },
      [":class"]() {
        return languageId == this.$store.session.languageId
          ? css.selected
          : css.nonSelected;
      }
    }
  },

  goNextButton: {
    ["@click.prevent"]() {
      if (!this.$store.session.batteryId) return;
      if (this.$store.session.completedBatteries.includes(this.$store.session.batteryId)) return;
      if (this.$store.app.tutorialSwitch == "off") return goToUrl.call(this, [ "session", "open-session" ]);
      if (this.$store.app.tutorialSwitch == "on") return goToUrl.call(this, [ "tutorial" ]);
    },
    [":class"]() {
      return this.$store.session.settingId
        && this.$store.session.batteryId 
        && !this.$store.session.completedBatteries.includes(this.$store.session.batteryId)
          ? css.enabledButton
          : css.disabledButton
    }
  }
});
