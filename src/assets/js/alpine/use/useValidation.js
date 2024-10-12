import {
  object,
  objectLoose,
  string,
  number,
  array,
  fail,
  optional
} from "banditypes";

const validateTestee = object({
  bio: object({
    surname: string(),
    name: string(),
    placeOfBirth: string(),
    yearOfBirth: string().or(number()).map((val) => (/^\d{4,4}$/.test(val) ? val : fail())),
    gender: string().map((val) => (/[mf]{1,1}$/.test(val) ? val : fail())),
  })
});

const validateBattery = object({
  batteryId: string(),
  batteryName: string(),
  questionnaires: objectLoose(),
  answerTypes: array(string()),
});

const validateQuestionnaire = object({
  questionnaireId: string(),
  questionnaireName: string(),
  questionnaireLength: array(number()),
  questionnaireOrder: number(),
});

const validateItem = object({
  itemId: string(),
  answerValue: array(number().or(string())),
  answerLatency: number(),
  deltaAnswerLatency: number().or(optional()),
});

const validateJSON = object({
  testee: validateTestee,
  session: object({
    languageId: string(),
    settingId: string(),
    batteryId: string(),
    questionnaireId: string(),
    itemId: string(),
    battery: validateBattery,
    questionnaires: objectLoose(),
    completedBatteries: array(string()),
    completedQuestionnaires: array(string()),
    data: object({ 
      batteries: objectLoose(), questionnaires: objectLoose(), scores: objectLoose() 
    }),
  }),
  urls: object({
    urlBase: string(),
    urlSession: string(),
    urlBatteries: string(),
    urlQuestionnaires: string(),
    urlItem: string(),
    urlReports: string(),
    urlNotifications: string(),
    urlTutorial: string(),
  })
});

const parseDataToValidate = (JSONToValidate) => {
  try {
    try {
      validateJSON(JSONToValidate);
    } catch (err) {
      throw new Error("JSON has missing or improper elements");
    }
    for (const [batteryId, battery] of Object.entries(JSONToValidate.session.data.batteries)) {
      try {
        validateBattery(battery);
      } catch (err) {
        throw new Error(
          `Validation error for battery: ${batteryId}`
        );
      }
    }
    for (const [questionnaireId, questionnaire] of Object.entries(JSONToValidate.session.questionnaires)) {
      try {
        validateQuestionnaire(questionnaire);
      } catch (err) {
        throw new Error(
          `Validation error for questionnaire: ${questionnaireId}`
        );
      }
    }
    for (const [questionnaireId, questionnaire] of Object.entries(
      JSONToValidate.session.data.questionnaires
    )) {
      Object.values(questionnaire).forEach((item) => {
        try {
          validateItem(item);
        } catch (err) {
          throw new Error(
            `Validation error for item: ${questionnaireId}, ${item?.itemId}`
          );
        }
      });
    }
    return JSONToValidate;
  } catch (err) {
    throw new Error(err || "Oops! An unspecified error occurred");
  }
};

export default () => ({
  validateData(stringifiedJSON) {
    try {
      const JSONToValidate = JSON.parse(stringifiedJSON);
      return parseDataToValidate(JSONToValidate);
    } catch (err) {
      console.log(err);
      return undefined;
    }
  },
});
