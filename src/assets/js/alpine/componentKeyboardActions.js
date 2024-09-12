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

  getNextElementIndex(index, elements, direction) {
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
      const urlFilteredCatalogue = `${this.$store.urls.urlBatteries}/${lowercaseKey}`;
      lowercaseKey == "backspace" 
        && this.$store.app.currentView != "home"
        && history.back();
      this.$store.app.currentView == "batteries" 
        && this.alphabetLowerCase.includes(lowercaseKey) 
        && goToUrlRaw.call(this, urlFilteredCatalogue);
      ctrlKey && lowercaseKey == "a" && goToUrl.call(this, [ "session", "set-session" ]);
      ctrlKey && lowercaseKey == "b" && goToCurrentBattery.call(this);
      ctrlKey && lowercaseKey == "h" && goToUrl.call(this, [ "base"]);
      ctrlKey && lowercaseKey == "i" && goToCurrentItem.call(this);
      ctrlKey && lowercaseKey == "m" && (this.$store.app.burgerIsOpen = !this.$store.app.burgerIsOpen);
      ctrlKey && lowercaseKey == "q" && goToCurrentQuestionnaire.call(this);
    },
  },

  xArrowsActions: {
    ["@keyup.left.window"]() {
      this.$refs["page-left"]?.click();
    },
    ["@keyup.right.window"]() {
      this.$refs["page-right"] && this.$refs["page-right"].click();
      !this.$refs["page-right"] && this.$refs["main-button"].click();
    }
  },

  yArrowsActions: {
    ["@keyup.down.window"]() {
      if (this.$store.app.burgerIsOpen) {
        this.burgerIndex = this.getNextElementIndex(this.burgerIndex, this.burgerElements, "next");
      } else {
        if (this.hasTabElements) {
          this.tabIndex = this.getNextElementIndex(this.tabIndex, this.tabElements, "next");
          this.tabElements[this.tabIndex]?.click();
        }
      }
    },
    ["@keyup.up.window"]() {
      if (this.$store.app.burgerIsOpen) {
        this.burgerIndex = this.getNextElementIndex(this.burgerIndex, this.burgerElements, "prev");
      } else {
        if (this.hasTabElements) {
          this.tabIndex = this.getNextElementIndex(this.tabIndex, this.tabElements, "prev");
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
