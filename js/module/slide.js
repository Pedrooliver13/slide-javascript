export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
  }

  // primeiro vamos pegar o click;
  onStart(event) {
    event.preventDefault(); //previnir que vc segure a imagem;

    console.log('mousedown ta funcionando');
    this.wrapper.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove(event) {
    console.log("mousemove Tá movendo");
  }

  onEnd() {
    console.log('Acabou');
    this.wrapper.removeEventListener('mousemove', this.onMouseMove);
  }

  // vamos adicionar o evento para chamar o onStart;
  addSlideListener() {
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd); // vai chamar o onEnd
  }

  isBind() {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  init() {
    this.isBind();
    this.addSlideListener();

    return this;
  }
}