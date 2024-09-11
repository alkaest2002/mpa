
export default () => ({
  
  async initBase({ urlWorkerScript, urlScoringScript, urlTemplatingScript }) {
    this.$watch("$store.session.completedQuestionnaires", (val) => {
      if (val.length == 0) return;
      const myWorker = new Worker(urlWorkerScript);
      const questionnaireId = val.at(-1);
      const { bio } = this.$store.testee;
      const { settingId, languageId } = this.$store.session;
      const answers = this.$store.session.data.questionnaires[questionnaireId];
      const urlReportTemplate = this.$store.urls.getUrl([ "reports", questionnaireId ]);
      const urlQuestionnaire = this.$store.urls.getUrl([ "questionnaires", questionnaireId ]);
      const urlQuestionnaireSpecs = `${urlQuestionnaire}/index.json`;
      const workerData = JSON.parse(JSON.stringify({ 
        testee: { bio },
        session: { settingId, languageId },
        questionnaire: { questionnaireId, answers }, 
        urls: { urlQuestionnaireSpecs, urlReportTemplate, urlScoringScript, urlTemplatingScript }
      }));
      myWorker.postMessage(workerData);
      
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
