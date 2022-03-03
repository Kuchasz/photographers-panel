import { AppModule } from "./app.module";
import { checkIfMobile, checkIfSafari } from "../utils/browser";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import "./styles.scss";
import "core-js";
import "zone.js/dist/zone";
import "whatwg-fetch";
import "@angular/compiler";
import "roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss";
// import '@mdi/font';


platformBrowserDynamic().bootstrapModule(AppModule);

const setViewport = () => {
    const viewportTricks = !checkIfSafari() && checkIfMobile();

    const { innerWidth, innerHeight } = window;
    const { offsetWidth } = document.body;

    const v = viewportTricks
        ? {
              vw: `100%`,
              vh: `${Math.round((offsetWidth / innerWidth) * innerHeight)}px`,
          }
        : { vw: '100%', vh: '100%' };

    // console.log(v);

    document.documentElement.style.setProperty('--vh', v.vh);
    document.documentElement.style.setProperty('--vw', v.vw);
};

setViewport();
window.addEventListener('resize', setViewport);
