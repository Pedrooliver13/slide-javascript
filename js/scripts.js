import { SlideNav } from './module/slide.js';

const slide = new SlideNav('.slide', '[data-slide="container"]'); 
slide.init();
slide.addArrow('.prev', '.next');