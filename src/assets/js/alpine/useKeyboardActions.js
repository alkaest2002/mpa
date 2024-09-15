import useNavigation from "./useNavigation";

const { goToUrl, goToUrlRaw, goToCurrentBattery, goToCurrentQuestionnaire, goToCurrentItem } = useNavigation();

export default () => ({
  tabElements: null,
  burgerElements: null,
  tabIndex: -1,
  burgerIndex: -1,
  alphabetLowerCase: "abcdefghijklmnopqrstuvwxyz",

  initKeyboardActions(typeOfId = null) {
    this.burgerElements = [ ...document.getElementsByClassName("burger-element") ];
    this.tabElements = [ ...document.getElementsByClassName("tab-element") ];
    this.tabIndex = typeOfId 
      ? this.getElementIndex(this.$refs[`tab-${this.$store.session[typeOfId]}`])
      : -1;
  },

  get hasTabElements() {
    return this.tabElements?.length > 0;
  },

  getElementIndex(element) {
    if (!element) return -1;
    return [...element.parentNode.children].indexOf(element);
  },

  getNewElementIndex(index, elements, direction) {
    if (direction == "next") {
      return (index + 1) % elements.length;
    } else {
      return (index <= 0) 
        ? elements.length -1
        : index -1;
    }
  },

  alphabetActions: {
    ["@keyup.window"]({ key, ctrlKey }) {
      const lowercaseKey = key.toLowerCase();
      const urlItemsMap = `${this.$store.urls.urlQuestionnaires}/${this.$store.session.questionnaireId}/map.html`;
      const urlFilteredCatalogue = `${this.$store.urls.urlBatteries}/${lowercaseKey}`;
      if (lowercaseKey == "escape" ) {
        // when in map view go back to last item
        this.$store.app.currentView == "map"
          && goToUrlRaw.call(this, this.$store.urls.urlItem);
        // in all other case (except home), use app history object to figure out where to go back
        !["home", "map"].includes(this.$store.app.currentView)
          && goToUrlRaw.call(this, this.$store.app.history[window.location.href]);
      } else {
        this.$store.app.currentView == "batteries" 
          && this.alphabetLowerCase.includes(lowercaseKey) 
          && goToUrlRaw.call(this, urlFilteredCatalogue);
        ctrlKey 
          && lowercaseKey == "a"
          && goToUrl.call(this, [ "session", "set-session" ]);
        ctrlKey 
          && lowercaseKey == "b"
          && this.$store.session.batteryId
          && goToCurrentBattery.call(this);
        ctrlKey 
          && lowercaseKey == "d" 
          && (this.$store.app.burgerIsOpen = !this.$store.app.burgerIsOpen);
        ctrlKey 
          && lowercaseKey == "h" 
          && goToUrl.call(this, [ "base"]);
        ctrlKey 
          && lowercaseKey == "i"
          && this.$store.session.itemId
          && goToCurrentItem.call(this);
        ctrlKey 
          && lowercaseKey == "m"
          && this.$store.session.itemId
          && goToUrlRaw.call(this, urlItemsMap);
        ctrlKey && lowercaseKey == "q" && goToCurrentQuestionnaire.call(this);
      }
    },
  },

  xArrowsActions: {
    ["@keyup.left.window"]() {
      this.$refs["page-left"]?.click();
    },
    ["@keyup.right.window"]() {
      this.$refs["page-right"]?.click();
    }
  },

  yArrowsActions: {
    ["@keyup.down.window"]() {
      if (this.$store.app.burgerIsOpen) {
        this.burgerIndex = this.getNewElementIndex(this.burgerIndex, this.burgerElements, "next");
      } else {
        if (this.hasTabElements) {
          this.tabIndex = this.getNewElementIndex(this.tabIndex, this.tabElements, "next");
          this.tabElements[this.tabIndex]?.click();
        }
      }
    },
    ["@keyup.up.window"]() {
      if (this.$store.app.burgerIsOpen) {
        this.burgerIndex = this.getNewElementIndex(this.burgerIndex, this.burgerElements, "prev");
      } else {
        if (this.hasTabElements) {
          this.tabIndex = this.getNewElementIndex(this.tabIndex, this.tabElements, "prev");
          this.tabElements[this.tabIndex]?.click();
        }
      }
    },
  },

  enterActions: {
    ["@keyup.enter.window"]() {
      this.$store.app.burgerIsOpen && this.burgerElements[this.burgerIndex]?.click();
      !this.$store.app.burgerIsOpen && this.$refs["main-button"]?.click();
    },
  },
});
