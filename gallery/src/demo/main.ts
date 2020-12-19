import 'core-js';
import 'zone.js/dist/zone';
import 'whatwg-fetch';
import "./styles.scss";
import 'roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss';
// import '@mdi/font';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {AppModule} from "./app.module";

platformBrowserDynamic().bootstrapModule(AppModule);

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

// We listen to the resize event
window.addEventListener('resize', () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});