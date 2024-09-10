
export default () => ({
  
  async initBase({ urlWorkerScript, urlScoringScript, urlTemplatingScript }) {
    this.$watch("$store.session.completedQuestionnaires", (val) => {
      const questionnaireId = val.at(-1);
      if (!questionnaireId) return;
      const settingId = this.$store.session.settingId;
      const languageId = this.$store.session.languageId;
      const testeeData = JSON.parse(JSON.stringify({ ...{ bio: this.$store.testee.bio }, settingId, languageId }));
      const questionnaireData = JSON.parse(JSON.stringify(this.$store.session.data.questionnaires[questionnaireId]));
      const urlQuestionnaire = this.$store.urls.getUrl([ "questionnaires", questionnaireId ]);
      const urlQuestionnaireSpecs = `${urlQuestionnaire}/index.json`;
      const urlReportTemplate = this.$store.urls.getUrl([ "reports", questionnaireId ]);
      const myWorker = new Worker(urlWorkerScript);
      myWorker.postMessage({ 
        testeeData,
        questionnaireId, 
        questionnaireData, 
        urlQuestionnaireSpecs, 
        urlReportTemplate,
        urlScoringScript,
        urlTemplatingScript,
      });
      myWorker.onmessage = ({ data }) => {
        const { questionnaireId, questionnaireScores, questionnaireReport } = data;
        this.$store.session.data.scores[questionnaireId] = questionnaireScores;
        this.$store.session.reports[questionnaireId] = questionnaireReport;
      };
    });
  },

  htmxEvents: {
    ["@htmx:after-swap.camel"]() {
      this.$store.app.burgerIsOpen = false; 
    },
  }
});
