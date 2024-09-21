import useNavigation from "./useNavigation";

const { 
  goToUrl, 
  goToUrlRaw, 
  goToCurrentBattery, 
  goToCurrentQuestionnaire,
  goToCurrentQuestionnaireMap, 
  goToCurrentItem 
} = useNavigation();

export default () => ({
  burgerElements: null,
  tabElements: null,
  tabIndex: -1,
  burgerIndex: -1,
  alphabetLowerCase: "abcdefghijklmnopqrstuvwxyz",

  initKeyboardActions(typeOfId = null) {
    this.burgerElements = [...document.getElementsByClassName("burger-element")];
    this.tabElements = [...document.getElementsByClassName("tab-element")];
    this.tabIndex = typeOfId 
      ? this.getElementIndex(this.$refs[`tab-${this.$store.session[typeOfId]}`]) 
      : -1;
  },

  get hasTabElements() {
    return !!this.tabElements?.length;
  },

  getElementIndex(element) {
    return element 
      ? [...element.parentNode.children].indexOf(element) 
      : -1;
  },

  getNewElementIndex(index, elements, direction) {
    return direction == "next" 
      ? (index + 1) % elements.length 
      : (index <= 0 
          ? elements.length - 1 
          : index - 1
        );
  },

  handleKeyAction({ lowercaseKey, ctrlKey, escKey, appView }) {
    ctrlKey && this.handleCtrlActions(lowercaseKey);
    escKey && this.handleEscapeKeyActions(appView);
    (!ctrlKey && !escKey) && this.handleAppViewActions(appView, lowercaseKey);
  },

  handleCtrlActions(lowercaseKey) {
    return {
      a: () => goToUrl.call(this, ["session", "session-set"]),
      b: () => this.$store.session.batteryId && goToCurrentBattery.call(this),
      d: () => this.$store.app.burgerIsOpen = !this.$store.app.burgerIsOpen,
      h: () => goToUrl.call(this, ["base"]),
      i: () => this.$store.session.itemId && goToCurrentItem.call(this),
      m: () => this.$store.session.itemId && goToCurrentQuestionnaireMap.call(this),
      q: () => goToCurrentQuestionnaire.call(this),
    }[lowercaseKey]?.();
  },

  handleEscapeKeyActions(appView) {
    return (![ "home", "questionnaire-map", "batteries-letter" ].includes(appView)) 
      ? goToUrlRaw.call(this, this.$store.app.history[window.location.href])
      : (() => {
          appView == "questionnaire-map" && goToUrlRaw.call(this, this.$store.urls.urlItem);
          appView == "batteries-letter" && goToUrl.call(this, [ "batteries" ]);
        })();
  },

  handleAppViewActions(appView, lowercaseKey) {
    return [ "batteries", "batteries-letter" ].includes(appView)  
      && this.alphabetLowerCase.includes(lowercaseKey) 
      && goToUrl.call(this, [ "batteries", lowercaseKey ]);
  },

  alphabetActions: {
    ["@keyup.window"]({ key, ctrlKey }) {
      const lowercaseKey = key.toLowerCase();
      const escKey = lowercaseKey == "escape";
      const appView = this.$store.app.currentView;
      this.handleKeyAction({ lowercaseKey, ctrlKey, escKey, appView });
    },
  },

  xArrowsActions: {
    ["@keyup.left.window"]() {
      this.$refs["page-left"]?.click();
    },
    ["@keyup.right.window"]() {
      this.$refs["page-right"]?.click();
    },
  },

  yArrowsActions: {
    ["@keyup.down.window"]() {
      const elements = this.$store.app.burgerIsOpen ? this.burgerElements : this.tabElements;
      const index = this.$store.app.burgerIsOpen ? "burgerIndex" : "tabIndex";
      this[index] = this.getNewElementIndex(this[index], elements, "next");
      !this.$store.app.burgerIsOpen && elements[this[index]]?.click();
    },
    ["@keyup.up.window"]() {
      const elements = this.$store.app.burgerIsOpen ? this.burgerElements : this.tabElements;
      const index = this.$store.app.burgerIsOpen ? "burgerIndex" : "tabIndex";
      this[index] = this.getNewElementIndex(this[index], elements, "prev");
      !this.$store.app.burgerIsOpen && elements[this[index]]?.click();
    },
  },

  enterActions: {
    ["@keyup.enter.window"]() {
      const elements = this.$store.app.burgerIsOpen ? this.burgerElements : [this.$refs["main-button"]];
      elements[(this.burgerIndex !== -1 ? this.burgerIndex : 0)]?.click();
    },
  },
});