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
    ["@keyup.window"]({ key, altKey }) {
      if (this.$store.app.lockUI) return;
      const lowercaseKey = key.toLowerCase();
      const urlFilteredCatalogue = `${this.$store.urls.urlBatteries}/${lowercaseKey}`;
      lowercaseKey == "backspace" 
        && this.$store.app.currentView != "home"
        && history.back();
      this.$store.app.currentView == "batteries" 
        && this.alphabetLowerCase.includes(lowercaseKey) 
        && goToUrlRaw.call(this, urlFilteredCatalogue);
      altKey && lowercaseKey == "a" && goToUrl.call(this, [ "session", "set-session" ]);
      altKey && lowercaseKey == "h" && goToUrl.call(this, [ "base"]);
      altKey && lowercaseKey == "b" && goToCurrentBattery.call(this);
      altKey && lowercaseKey == "q" && goToCurrentQuestionnaire.call(this);
      altKey && lowercaseKey == "i" && goToCurrentItem.call(this);
      
    },
  },

  xArrowsActions: {
    ["@keyup.left.window"]() {
      if (this.$store.app.lockUI) return;
      this.$refs["page-left"]?.click();
    },
    ["@keyup.right.window"]() {
      if (this.$store.app.lockUI) return;
      this.$refs["page-right"] && this.$refs["page-right"].click();
      !this.$refs["page-right"] && this.$refs["main-button"].click();
    }
  },

  yArrowsActions: {
    ["@keyup.down.window"]({ altKey }) {
      if (this.$store.app.lockUI) return;
      if (altKey) {
        return (this.$store.app.burgerIsOpen = !this.$store.app.burgerIsOpen);
      }
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
      if (this.$store.app.lockUI) return;
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
      if (this.$store.app.lockUI) return;
      this.$store.app.burgerIsOpen && this.burgerElements[this.burgerIndex]?.click();
      !this.$store.app.burgerIsOpen && this.$refs["main-button"]?.click();
    },
  },
});
