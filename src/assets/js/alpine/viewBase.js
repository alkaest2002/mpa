
export default () => ({
  
  async initBase({ urlWorkerReportScript, urlWorkerMergeReportsScript, urlScoringScript, urlTemplatingScript }) {

    this.$watch("$store.app.currentView", (val) => val == "home" && (this.$store.app.history = {}));
    
    this.$watch("$store.session.completedQuestionnaires", (val) => {
      
      if (val.length == 0) return;
      
      const questionnaireId = val.at(-1);
      const { bio } = this.$store.testee;
      const { settingId, languageId } = this.$store.session;
      const answers = this.$store.session.data.questionnaires[questionnaireId];
      const urlReportTemplate = this.$store.urls.getUrl([ "reports", questionnaireId ]);
      const urlQuestionnaire = this.$store.urls.getUrl([ "questionnaires", questionnaireId ]);
      const urlQuestionnaireSpecs = `${urlQuestionnaire}/index.json`;
      
      // worker to compute and render single report
      const workerReport = new Worker(urlWorkerReportScript);
      // data to pass to worker
      const workerData = JSON.parse(JSON.stringify({ 
        testee: { bio },
        session: { settingId, languageId },
        questionnaire: { questionnaireId, answers }, 
        urls: { urlQuestionnaireSpecs, urlReportTemplate, urlScoringScript, urlTemplatingScript }
      }));
      
      this.$store.reports.generatingReports = true;
      workerReport.postMessage(workerData);
      
      workerReport.onmessage = ({ data }) => {
        const { questionnaireId, questionnaireScores, questionnaireReport, questionnaireAnswers } = data;
        this.$store.session.data.questionnaires[questionnaireId] = questionnaireAnswers;
        this.$store.session.data.scores[questionnaireId] = questionnaireScores;
        this.$store.reports.singleReports = {
          ...this.$store.reports.singleReports,
          [questionnaireId]: questionnaireReport
        };
      };
    });

    this.$watch("$store.reports.singleReports", (val) => {
      
      if (Object.values(val).length == 0) return;
      
      // worker to merge reports together
      const workerMergedReports = new Worker(urlWorkerMergeReportsScript);
      // data to pass to the work
      const workerData = JSON.parse(JSON.stringify({ 
        singleReports: this.$store.reports.singleReports,
      }));
      workerMergedReports.postMessage(workerData);
      workerMergedReports.onmessage = ({ data }) => {
        const { mergedReports } = data;
        this.$store.reports.mergedReports = mergedReports;
        this.$store.reports.generatingReports = false;
      };
    });
  },

  htmxEvents: {
    ["@htmx:before-swap.camel"]({ detail: { xhr: { responseURL }}}) {
        // excelude url with map.html
        [responseURL, window.location.href].every(el => el.search("map.html") === -1)
          // exclude urls visited twice
          && !Object.keys(this.$store.app.history).includes(responseURL)
          // store relationship as chils --> parent
          && (this.$store.app.history[responseURL] = window.location.href);
    },
    ["@htmx:after-swap.camel"]() {
      this.$store.app.burgerIsOpen = false; 
    },
  }
});
