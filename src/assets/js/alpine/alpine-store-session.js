import { initState, exportState, importState, wipeState } from "./useUtilsAlpine";
import { median } from "./useUtilsMath";

const stateFn = () => [
  [ "languageId", "it" ], 
  [ "settingId", "normal"], 
  [ "batteryId", ""],
  [ "questionnaireId", ""],
  [ "itemId", ""],
  [ "battery", {}],
  [ "questionnaires", {}],
  [ "completedBatteries", []], 
  [ "completedQuestionnaires", []],
  [ "data", { "batteries": {}, "questionnaires": {}, "scores": {}}], 
  [ "reports", {}]
];

export default (Alpine) => ({

  ...initState(Alpine, stateFn),

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
    return this.currentAnswerValue == "" 
      ? "no-response"
      : this.currentAnswerValue;
  },

  get exportState() {
    return exportState.call(this, stateFn);
  },

  getBatteryIsComplete(batteryId) {
    return this.completedBatteries.includes(batteryId);
  },

  getBatteryIsRunning(batteryId) {
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

  importState(dataJSON) {
    importState.call(this, dataJSON);
  },

  wipeState(omit = []) {
    wipeState.call(this, omit, stateFn) ;
  }
})
