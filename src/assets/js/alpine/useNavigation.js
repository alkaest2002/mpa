export default () => ({
  
  setUrl(urls) {
    for (const [urlKey, url] of Object.entries(urls)) {
      if (urlKey in this.$store.urls) {
        this.$store.urls[urlKey] = url;
      }
    }
  },

  goToCurrentBattery() {
    window.htmx.ajax("GET", this.$store.urls.urlCurrentBattery, "body");
  },

  goToCurrentQuestionnaire() {
    window.htmx.ajax("GET", this.$store.urls.urlCurrentQuestionnaire, "body");
  },

  goToQuestionnaire(questionnaireId) {
    const questionnaireUrl = this.$store.urls.getUrl([ "questionnaires", questionnaireId ]);
    window.htmx.ajax("GET", questionnaireUrl, "body");
  },

  goToUrl(sections = []) {
    const urlToGo = this.$store.urls.getUrl(sections);
    window.htmx.ajax("GET", urlToGo, "body");
  },

  goToUrlRaw(url) {
    window.htmx.ajax("GET", url, "body");
  },
});
