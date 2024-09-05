

export default () => ({
  
  async initBase({ urlWorkerScript, urlScoringScript, urlTemplatingScript }) {
    this.$watch("$store.session.completedQuestionnaires", (val) => {
      const questionnaireId = val.slice(-1)[0];
      if (!questionnaireId)
        return;
      if (!(this.$store.session.questionnaires[questionnaireId]?.questionnaireShouldBeScored))
        return;
      const settingId = this.$store.session.settingId;
      const testeeData = JSON.parse(JSON.stringify({ ...this.$store.testee.bio, settingId }));
      const questionnaireData = JSON.parse(JSON.stringify(this.$store.session.data.questionnaires[questionnaireId]));
      const urlQuestionnaire = this.$store.urls.getUrl([ "questionnaires", questionnaireId ]);
      const urlQuestionnaireSpecs = `${urlQuestionnaire}/index.json`;
      const urlReportTemplate = this.$store.urls.getUrl([ "reports", questionnaireId ]);
      const myWorker = new Worker(urlWorkerScript);
      myWorker.postMessage({ 
        settingId,
        questionnaireId, 
        questionnaireData, 
        testeeData,
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
