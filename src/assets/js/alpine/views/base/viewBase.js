import css from "../../cssClasses.json";
import useNagigation from "../../use/useNavigation";

const { goToUrl } = useNagigation();

export default () => ({
  
  async initBase({ urlWorkerReportScript, urlWorkerMergeReportsScript, urlScoringScript, urlTemplatingScript }) {

    this.$watch("$store.session.completedQuestionnaires", (val) => {
      // safeguard
      if (val.length == 0) return;
      // prepare data to pass to worker
      const questionnaireId = val.at(-1);
      const { bio } = this.$store.testee;
      const { settingId, languageId } = this.$store.session;
      const answers = this.$store.session.data.questionnaires[questionnaireId];
      const urlReportTemplate = this.$store.urls.getUrl([ "reports", questionnaireId ]);
      const urlQuestionnaire = this.$store.urls.getUrl([ "questionnaires", questionnaireId ]);
      const urlQuestionnaireSpecs = `${urlQuestionnaire}/index.json`;
      // assemble data to pass to worker
      const workerData = JSON.parse(JSON.stringify({ 
        testee: { bio },
        session: { settingId, languageId },
        questionnaire: { questionnaireId, answers }, 
        urls: { urlQuestionnaireSpecs, urlReportTemplate, urlScoringScript, urlTemplatingScript }
      }));
      // init worker
      const workerReport = new Worker(urlWorkerReportScript);
      // switch on generating report flag
      this.$store.reports.generatingReports = true;
      // activate worker
      workerReport.postMessage(workerData);
      // process worker response
      workerReport.onmessage = ({ data }) => {
        // on error
        if (data.error ) {
          // notify developer
          console.log(data.error)
          // go to error page
          goToUrl.call(this, [ "notifications", "errors", "error-generating-report" ]);
        // on success
        } else {
          const { questionnaireId, questionnaireScores, questionnaireReport, questionnaireAnswers } = data;
          this.$store.session.data.questionnaires[questionnaireId] = questionnaireAnswers;
          this.$store.session.data.scores[questionnaireId] = questionnaireScores;
          this.$store.reports.singleReports = {
            ...this.$store.reports.singleReports,
            [questionnaireId]: questionnaireReport
          };
        };
      };
    });

    this.$watch("$store.reports.singleReports", (val) => {
      // safeguard
      if (Object.values(val).length == 0) return;
      // data to pass to the work
      const workerData = JSON.parse(JSON.stringify({ 
        singleReports: this.$store.reports.singleReports,
      }));
      // init worker
      const workerMergedReports = new Worker(urlWorkerMergeReportsScript);
      // activate worker
      workerMergedReports.postMessage(workerData);
      // process response from worker
      workerMergedReports.onmessage = ({ data }) => {
        const { mergedReports } = data;
        this.$store.reports.mergedReports = mergedReports;
        // switch off generating report flag
        this.$store.reports.generatingReports = false;
      };
    });
  },

  htmxEvents: {
    ["@htmx:after-swap.camel"]() {
      this.$store.app.burgerIsOpen = false; 
    },
  },

  opacity: {
    [":class"]() {
      return this.$store.app.burgerIsOpen
        ? css.display["opacity-20"]
        : null 
    }
  }
});
