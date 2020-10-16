import Slide from './module/slide.js';

const slide = new Slide('.slide', '[data-slide="container"]'); 
slide.init();

slide.changeSlide(1);
slide.activeNextSlide();