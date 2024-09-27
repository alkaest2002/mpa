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
  actionType: null,

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
    const nextIndex = direction == "next" 
      ? (index + 1) % elements.length 
      : (index <= 0 
          ? elements.length - 1 
          : index - 1
        );
    return nextIndex;
  },

  handleKeyAction({ lowercaseKey, ctrlKey, escKey, appView }) {
    ctrlKey && this.handleCtrlActions(appView, lowercaseKey);
    escKey && !this.$store.app.burgerIsOpen && this.handleEscapeKeyActions(appView);
    (!ctrlKey && !escKey) && this.handleAppViewActions(appView, lowercaseKey);
  },

  handleCtrlActions(appView, lowercaseKey) {
    this.actionType = "keyboard";
    return {
      "a": () => appView == "home" && goToUrl.call(this, ["session", "session-set"]),
      "b": () => this.$store.session.batteryId && goToCurrentBattery.call(this),
      "d": () => this.$store.app.burgerIsOpen = !this.$store.app.burgerIsOpen,
      "h": () => goToUrl.call(this, [ "base" ]),
      "i": () => this.$store.session.itemId && goToCurrentItem.call(this),
      "m": () => this.$store.session.itemId && goToCurrentQuestionnaireMap.call(this),
      "q": () => goToCurrentQuestionnaire.call(this),
    }[lowercaseKey]?.();
  },

  handleEscapeKeyActions(appView) {
    this.actionType = "keyboard";
    return {
      "session-set": () => goToUrl.call(this, [ "base" ]),
      "batteries": () => goToUrl.call(this, [ "session", "session-set" ]),
      "batteries-letter": () => goToUrl.call(this, [ "batteries" ]),
      "battery": () => goToUrl.call(this, [ "session", "session-open" ]),
      "tutorial": () => goToUrl.call(this, [ "base" ]),
      "questionnaire-intro": () => goToCurrentBattery.call(this),
      "questionnaire-item": () => goToCurrentQuestionnaire.call(this),
      "questionnaire-map": () => goToUrlRaw.call(this, this.$store.urls.urlItem),
      "session-open": () => goToUrl.call(this, [ "base" ]),
    }[appView]?.();
  },

  handleAppViewActions(appView, lowercaseKey) {
    this.actionType = "keyboard";
    [ "batteries", "batteries-letter" ].includes(appView)  
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

  mouseActions: {
    ["@mouseup.window"]() {
      this.actionType = "mouse";
    }
  },

  xArrowsActions: {
    ["@keyup.left.window"]() {
      this.actionType = "keyboard";
      this.$refs["page-left"]?.click();
    },
    ["@keyup.right.window"]() {
      this.actionType = "keyboard";
      this.$refs["page-right"]?.click();
    },
  },

  yArrowsActions: {
    ["@keyup.down.window"]() {
      this.actionType = "keyboard";
      const elements = this.$store.app.burgerIsOpen ? this.burgerElements : this.tabElements;
      const index = this.$store.app.burgerIsOpen ? "burgerIndex" : "tabIndex";
      this[index] = this.getNewElementIndex(this[index], elements, "next");
      !this.$store.app.burgerIsOpen && elements[this[index]]?.click();
    },
    ["@keyup.up.window"]() {
      this.actionType = "keyboard";
      const elements = this.$store.app.burgerIsOpen ? this.burgerElements : this.tabElements;
      const index = this.$store.app.burgerIsOpen ? "burgerIndex" : "tabIndex";
      this[index] = this.getNewElementIndex(this[index], elements, "prev");
      !this.$store.app.burgerIsOpen && elements[this[index]]?.click();
    },
  },

  enterActions: {
    ["@keyup.enter.window"]() {
      this.actionType = "keyboard";
      const elements = this.$store.app.burgerIsOpen ? this.burgerElements : [this.$refs["main-button"]];
      elements[(this.burgerIndex !== -1 ? this.burgerIndex : 0)]?.click();
    },
  },
});