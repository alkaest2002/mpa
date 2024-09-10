import Htmx from "htmx.org";
import { jsonEnc } from "./htmx-extend";

window.htmx = Htmx;
Htmx.defineExtension("json-enc", jsonEnc);