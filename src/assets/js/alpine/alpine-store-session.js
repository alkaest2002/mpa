import { median } from "./useUtils";

export default (Alpine) => ({
  languageId: Alpine.$persist("it").using(sessionStorage),
  settingId: Alpine.$persist("normal").using(sessionStorage),
  batteryId: Alpine.$persist("").using(sessionStorage),
  questionnaireId: Alpine.$persist("").using(sessionStorage),
  itemId: Alpine.$persist("").using(sessionStorage),
  battery: Alpine.$persist({}).using(sessionStorage),
  questionnaires: Alpine.$persist({}).using(sessionStorage),
  completedBatteries: Alpine.$persist([]).using(sessionStorage),
  completedQuestionnaires: Alpine.$persist([]).using(sessionStorage),
  data: Alpine.$persist({ "batteries": {}, "questionnaires": {}, "scores": {}}).using(sessionStorage),
  reports: Alpine.$persist({}).using(sessionStorage),

  get currentBattery() {
    return this.battery;
  },

  get currentBatteryIsComplete() {
    return Object.keys(this.questionnaires).every((questionnaireId) =>
      this.completedQuestionnaires.includes(questionnaireId)
    );
  },

  get currentQuestionnaire() {
    return this.questionnaires[this.questionnaireId];
  },

  get currentQuestionnaireIsComplete() {
    const { questionnaireLength } = this.currentQuestionnaire;
    return (Object.keys(this.data.questionnaires[this.questionnaireId]) || []).length == questionnaireLength;
  },

  get currentAnswer() {
    return this.data.questionnaires?.[this.questionnaireId]?.[this.itemId];
  },

  get currentAnswerValue() {
    return this.currentAnswer?.answerValue;
  },

  get answerId() {
    return this.currentAnswerValue == "?" 
      ? "no-response"
      : this.currentAnswerValue;
  },

  get dataToExport() {
    return ["languageId", "settingId", "batteryId","questionnaireId", "itemId", "battery",
      "questionnaires", "completedBatteries", "completedQuestionnaires", "data", "reports"
    ].reduce((acc, itr) => ({ ...acc, ...{ [itr]: this[itr]}}), {});
  },

  getBatteryIsComplete(batteryId) {
    return this.completedBatteries.includes(batteryId);
  },

  getBatteryIsRunning(batteryId) {
    if (!this.data.batteries[batteryId]) return false;
    const batteryQuestionnaires = Object.keys(this.data.batteries[batteryId]?.questionnaires ?? {});
    return !this.getBatteryIsComplete(batteryId) 
      && Object.keys(this.data.batteries).includes(batteryId)
      && Object.keys(this.data.questionnaires)
        .some((el) => batteryQuestionnaires.includes(el));
  },

  getQuestionnaireIsComplete(questionnaireId) {
    return this.completedQuestionnaires.includes(questionnaireId);
  },

  getQuestionnaireIsRunning(questionnaireId) {
    return !this.getQuestionnaireIsComplete(questionnaireId) 
      && Object.keys(this.data.questionnaires).includes(questionnaireId);
  },

  addCurrentBatteryToCompletedList() {
    this.completedBatteries = [... new Set([...this.completedBatteries, this.batteryId ])]
  },

  addCurrentQuestionnaireToCompletedList() {
    const completedQuestionnaire = this.data.questionnaires[this.questionnaireId];
    const answerIds = Object.keys(completedQuestionnaire);
    const answersLatencies = answerIds.map((answerId) => completedQuestionnaire[answerId].answerLatency);
    const medianLatency = median(answersLatencies);
    answerIds
      .forEach((answerId) => {
        completedQuestionnaire[answerId]["deltaAnswerLatency"] = 
        completedQuestionnaire[answerId].answerLatency - medianLatency
      });
    this.completedQuestionnaires = [... new Set([...this.completedQuestionnaires, this.questionnaireId ])];
  },

  setAnswerData(answerData) {
    this.data.questionnaires[this.questionnaireId] ??= {};
    this.data.questionnaires[this.questionnaireId][this.itemId] = answerData;
  },

  getAnswer(itemId) {
    return this.data.questionnaires?.[this.questionnaireId]?.[itemId]?.answerValue;
  },

  deleteAnswer(itemId) {
    delete this.data.questionnaires?.[this.questionnaireId]?.[itemId];
  },

  importData(dataJSON) {
    this.wipeOut();
    for (const [key, val] of Object.entries(dataJSON)) {
      if (key in this) this[key] = val;
    }
  },

  wipeOut(omit = []) {
    this.languageId = omit.includes("languageId") ? this.languageId : "it";
    this.settingId = omit.includes("settingId") ? this.settingId : "normal";
    this.batteryId = omit.includes("batteryId") ? this.batteryId : "";
    this.questionnaireId = omit.includes("questionnaireId") ? this.questionnaireId : "";
    this.itemId = omit.includes("itemId") ? this.itemId : "";
    this.battery = omit.includes("battery") ? this.battery : {};
    this.questionnaires = omit.includes("questionnaires") ? this.questionnaires : {};
    this.completedBatteries = omit.includes("completedBatteries") ? this.completedBatteries : [];
    this.completedQuestionnaires = omit.includes("completedQuestionnaires") ? this.completedQuestionnaires : [];
    this.data = omit.includes("data") ? this.data : { "batteries": {}, "questionnaires": {}, "scores": {} };
    this.reports = omit.includes("reports") ? this.reports : {};
  },
});