import Alpine from "alpinejs";
import persist from "@alpinejs/persist";
import storeApp from "./alpine-store-app";
import storeTestee from "./alpine-store-testee";
import storeSession from "./alpine-store-session";
import storeUrls from "./alpine-store-urls";
import componentKeyboardActions from "./componentKeyboardActions";
import viewBase from "./viewBase";
import viewHome from "./viewHome";
import viewTutorial from "./viewTutorial";
import viewBatteries from "./viewBatteries";
import viewBattery from "./viewBattery";
import viewIntro from "./viewIntro";
import viewItem from "./viewItem";
import viewMap from "./viewMap";
import viewSession from "./viewSession";
import viewSessionSet from "./viewSessionSet";
import viewNotifications from "./viewNotifications";

Alpine.plugin(persist);
Alpine.store("app", storeApp(Alpine));
Alpine.store("testee", storeTestee(Alpine));
Alpine.store("session", storeSession(Alpine));
Alpine.store("urls", storeUrls(Alpine));
Alpine.data("componentKeyboardActions", componentKeyboardActions)
Alpine.data("viewBase", viewBase);
Alpine.data("viewHome", viewHome);
Alpine.data("viewTutorial", viewTutorial);
Alpine.data("viewBatteries", viewBatteries);
Alpine.data("viewBattery", viewBattery);
Alpine.data("viewIntro", viewIntro);
Alpine.data("viewItem", viewItem);
Alpine.data("viewMap", viewMap);
Alpine.data("viewSession", viewSession);
Alpine.data("viewSessionSet", viewSessionSet);
Alpine.data("viewNotifications", viewNotifications);

window.Alpine ?? (window.Alpine = Alpine).start();