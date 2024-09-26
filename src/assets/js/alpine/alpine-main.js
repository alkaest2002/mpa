import Alpine from "alpinejs";
import persist from "@alpinejs/persist";

import storeApp from "./stores/alpine-store-app";
import storeTestee from "./stores/alpine-store-testee";
import storeReports from "./stores/alpine-store-reports";
import storeSession from "./stores/alpine-store-session";
import storeUrls from "./stores/alpine-store-urls";

import useKeyboardActions from "./use/useKeyboardActions";

import viewBase from "./views/base/viewBase";
import viewHome from "./views/home/viewHome";
import viewTutorial from "./views/tutorial/viewTutorial";

import viewBatteries from "./views/batteries/viewBatteries";
import viewBattery from "./views/batteries/viewBattery";

import viewQuestionnaireIntro from "./views/questionnaires/viewQuestionnaireIntro";
import viewQuestionnaireItem from "./views/questionnaires/viewQuestionnaireItem";
import viewQuestionnaireItemMultiple from "./views/questionnaires/viewQuestionnaireItemMultiple";
import viewQuestionnaireMap from "./views/questionnaires/viewQuestionnaireMap";

import viewSessionSet from "./views/session/viewSessionSet";
import viewSessionOpen from "./views/session/viewSessionOpen";
import viewSessionClose from "./views/session/viewSessionClose";
import viewSessionPause from "./views/session/viewSessionPause";
import viewSessionResume from "./views/session/viewSessionResume";

import viewQuestionnaireComplete from "./views/notifications/viewQuestionnaireComplete";
import viewQuestionnaireIncomplete from "./views/notifications/viewQuestionnaireIncomplete";
import viewBatteryComplete from "./views/notifications/viewBatteryComplete";

Alpine.plugin(persist);
Alpine.store("app", storeApp(Alpine));
Alpine.store("testee", storeTestee(Alpine));
Alpine.store("reports", storeReports(Alpine));
Alpine.store("session", storeSession(Alpine));
Alpine.store("urls", storeUrls(Alpine));
Alpine.data("useKeyboardActions", useKeyboardActions)
Alpine.data("viewBase", viewBase);
Alpine.data("viewHome", viewHome);
Alpine.data("viewTutorial", viewTutorial);
Alpine.data("viewSessionSet", viewSessionSet);
Alpine.data("viewSessionOpen", viewSessionOpen);
Alpine.data("viewSessionClose", viewSessionClose);
Alpine.data("viewSessionPause", viewSessionPause);
Alpine.data("viewSessionResume", viewSessionResume);
Alpine.data("viewBatteries", viewBatteries);
Alpine.data("viewBattery", viewBattery);
Alpine.data("viewBatteryComplete", viewBatteryComplete);
Alpine.data("viewQuestionnaireIntro", viewQuestionnaireIntro);
Alpine.data("viewQuestionnaireItem", viewQuestionnaireItem);
Alpine.data("viewQuestionnaireItemMultiple", viewQuestionnaireItemMultiple);
Alpine.data("viewQuestionnaireMap", viewQuestionnaireMap);
Alpine.data("viewQuestionnaireComplete", viewQuestionnaireComplete);
Alpine.data("viewQuestionnaireIncomplete", viewQuestionnaireIncomplete);

window.Alpine ?? (window.Alpine = Alpine).start();