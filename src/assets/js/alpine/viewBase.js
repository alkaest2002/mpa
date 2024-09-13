
export default () => ({
  
  async initBase({ urlWorkerReportScript, urlWorkerMergeReportsScript, urlScoringScript, urlTemplatingScript }) {
    this.$watch("$store.session.completedQuestionnaires", (val) => {
      
      if (val.length == 0) return;
      
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
      
      // worker to compute and render single report
      this.$store.reports.generatingReports = true;
      const workerReport = new Worker(urlWorkerReportScript);
      workerReport.postMessage(workerData);
      workerReport.onmessage = ({ data }) => {
        const { questionnaireId, questionnaireScores, questionnaireReport, answers } = data;
        this.$store.session.data.questionnaires[questionnaireId] = answers;
        this.$store.session.data.scores[questionnaireId] = questionnaireScores;
        this.$store.reports.singleReports[questionnaireId] = questionnaireReport;
      };
    });

    // worker to merge reports together
    this.$watch("$store.reports.singleReports", (val) => {
      
      if (Object.values(val).length == 0) return;

      const workerData = JSON.parse(JSON.stringify({ 
        singleReports: this.$store.reports.singleReports,
      }));

      const workerMergedReports = new Worker(urlWorkerMergeReportsScript);
      workerMergedReports.postMessage(workerData);
      workerMergedReports.onmessage = ({ data }) => {
        const { mergedReports } = data;
        this.$store.reports.mergedReports = mergedReports;
        this.$store.reports.generatingReports = false;
      };
    });
  },

  htmxEvents: {
    ["@htmx:after-swap.camel"]() {
      this.$store.app.burgerIsOpen = false; 
    },
  }
});
