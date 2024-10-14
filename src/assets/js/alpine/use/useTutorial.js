import css from "../cssClasses.json";
import useNavigation from "./useNavigation";

const { goToUrlRaw } = useNavigation();

export default () => ({
  
  answer: null,
  
  goNextButton(url) {
    return {
      ["@click.prevent"]() {
        console.log(url)
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
