import 'core-js';
import 'zone.js/dist/zone';
import 'whatwg-fetch';
import "./styles.scss";
import 'roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss';
// import '@mdi/font';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {AppModule} from "./app.module";

platformBrowserDynamic().bootstrapModule(AppModule);
