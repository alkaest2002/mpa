import Alpine from "alpinejs";
import persist from "@alpinejs/persist";
import storeApp from "./alpine/alpine-store-app";
import storeTestee from "./alpine/alpine-store-testee";
import storeSession from "./alpine/alpine-store-session";
import storeUrls from "./alpine/alpine-store-urls";
import componentKeyboardActions from "./alpine/componentKeyboardActions";
import viewBase from "./alpine/viewBase";
import viewHome from "./alpine/viewHome";
import viewTutorial from "./alpine/viewTutorial";
import viewBatteries from "./alpine/viewBatteries";
import viewBattery from "./alpine/viewBattery";
import viewIntro from "./alpine/viewIntro";
import viewItem from "./alpine/viewItem";
import viewMap from "./alpine/viewMap";
import viewSession from "./alpine/viewSession";
import viewSessionSet from "./alpine/viewSessionSet";
import viewNotifications from "./alpine/viewNotifications";

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