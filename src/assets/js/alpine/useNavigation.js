export default () => ({
  
  setUrl(urls) {
    for (const [urlKey, url] of Object.entries(urls)) {
      if (urlKey in this.$store.urls) {
        this.$store.urls[urlKey] = url;
      }
    }
  },

  goToCurrentBattery() {
    this.$store.urls.urlCurrentBattery && window.htmx.ajax("GET", this.$store.urls.urlCurrentBattery, "body");
  },

  goToCurrentQuestionnaire() {
    this.$store.urls.urlCurrentQuestionnaire && window.htmx.ajax("GET", this.$store.urls.urlCurrentQuestionnaire, "body");
  },

  goToCurrentItem() {
    this.$store.urls.urlCurrentItem && window.htmx.ajax("GET", this.$store.urls.urlCurrentItem, "body");
  },

  goToQuestionnaire(questionnaireId) {
    const questionnaireUrl = this.$store.urls.getUrl([ "questionnaires", questionnaireId ]);
    questionnaireUrl && window.htmx.ajax("GET", questionnaireUrl, "body");
  },

  goToUrl(sections = []) {
    const urlToGo = this.$store.urls.getUrl(sections);
    urlToGo && window.htmx.ajax("GET", urlToGo, "body");
  },

  goToUrlRaw(url) {
    url && window.htmx.ajax("GET", url, "body");
  },
});
