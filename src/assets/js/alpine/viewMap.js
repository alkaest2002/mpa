import css from "./cssClasses.json";
import useNagigation from "./useNavigation";

const { goToUrlRaw } = useNagigation();

export default () => ({

  initMap() {
    this.$store.app.currentView = "map";
    this.$refs["title"].innerText = this.$refs["title"].dataset.title;
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
        if (this.$store.session.getAnswer(itemId)) {
          this.$store.session.itemId = itemId;
          this.$store.urls.urlItem = urlItem;
        }
      },
      [":class"]() {
        if (this.$store.session.getAnswer(itemId)) {
          return this.$store.session.itemId == itemId
            ? css.selected
            : css.nonSelected;
        } else {
          return css.nonSelectable
        }
      }
    };
  },

  goToItemButton: {
    ["@click.prevent"]() {
      this.$store.urls.urlItem && goToUrlRaw.call(this, this.$store.urls.urlItem);
    },
    [":class"]() {
      return css.enabledButton
    },
  },
});
