import css from "../../cssClasses.json";
import useNavigation from "../../use/useNavigation";

const { goToUrlRaw } = useNavigation();

export default () => ({
  
  answer: null,
  
  goToNextTutorialButton(url) {
    return {
      ["@click.prevent"]() {
        this.getShouldGoNext() && goToUrlRaw.call(this, url);
      },
      [":class"]() {
        return this.getShouldGoNext()
          ? css.enabledButton
          : css.disabledButton
      }
    };
  },
});
