import css from "./cssClasses.json";
import useNagigation from "./useNavigation";

const { goToUrlRaw } = useNagigation();

export default () => ({

  initMap() {
    this.$store.app.currentView = "map";
    const el = this.$refs["titleWithPagination"];
    el.innerText = el.dataset.title;
  },

  showDot(itemId) {
    return {
      [":class"]() {
        return this.$store.session.getAnswer(itemId)
          ? css.blueDot
          : css.grayDot;
      }
    }
  },

  itemMapButton(itemId, urlItem) {
    return {
      ["@click.prevent"]() {
        this.$store.session.itemId = itemId;
        this.$store.urls.urlItem = urlItem;
      },
      [":class"]() {
        return this.$store.session.itemId == itemId
          ? css.selected
          : css.nonSelected
      }
    };
  },

  goToItemButton: {
    ["@click.prevent"]() {
      goToUrlRaw.call(this, this.$store.urls.urlItem);
    },
    [":class"]() {
      return css.enabledButton
    },
  },
});
