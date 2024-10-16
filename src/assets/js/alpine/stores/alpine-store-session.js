import { initState, exportState, importState, wipeState } from "../use/useAlpineStore";

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
];

export default (Alpine) => ({

  ...initState(stateFn, Alpine),

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
    const answersLength = (Object.keys(this.data.questionnaires[this.questionnaireId]) || []).length;
    return questionnaireLength.includes(answersLength);
  },

  get currentAnswer() {
    return this.data.questionnaires?.[this.questionnaireId]?.[this.itemId];
  },

  get currentAnswerValue() {
    return this.currentAnswer?.answerValue;
  },

  get answerId() {
    return this.currentAnswerValue && this.currentAnswerValue.length == 0 
      ? "no-response"
      : this.currentAnswerValue;
  },

  get exportState() {
    return exportState.call(this, stateFn, "session");
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
    this.completedQuestionnaires = [... new Set([...this.completedQuestionnaires, this.questionnaireId ])];
  },

  getAnswer(itemId) {
    return this.data.questionnaires?.[this.questionnaireId]?.[itemId];
  },

  setAnswer(answerData) {
    this.data.questionnaires[this.questionnaireId] ??= {};
    this.data.questionnaires[this.questionnaireId][this.itemId] 
      ??= { itemOrder: Object.values(this.data.questionnaires[this.questionnaireId]).length };
    this.data.questionnaires[this.questionnaireId][this.itemId] = {
      ...this.data.questionnaires[this.questionnaireId][this.itemId],
      ...answerData
    };
  },

  deleteAnswer(itemId) {
    delete this.data.questionnaires?.[this.questionnaireId]?.[itemId];
  },

  getAnswerValue(itemId) {
    return this.getAnswer(itemId)?.answerValue;
  },

  importState(dataJSON) {
    importState.call(this, dataJSON?.session);
  },

  wipeState(omit = []) {
    wipeState.call(this, stateFn, omit) ;
  }
})
