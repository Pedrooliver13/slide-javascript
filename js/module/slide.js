export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);

    this.dist = { finalPosition: 0, startX: 0, moviment: 0 };
  }

  // pega a primeira posição do mouse e chama a event de mover o mouse(mousemove);
  onStart(event) {
    event.preventDefault();
    console.log("start");

    this.dist.startX = event.clientX;
    this.wrapper.addEventListener("mousemove", this.onMouseMove);
  }

  // responsável por mover o slide pelo style;
  moveSlide(distX) {
    this.dist.movePosition = distX; // posição final;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  // atualiza a posição do slide;
  updatePosition(clientX) {
    this.dist.moviment = (this.dist.startX - clientX) * 1.6;

    return this.dist.finalPosition - this.dist.moviment;
  }

  onMouseMove(event) {
    const finalPosition = this.updatePosition(event.clientX);
    this.moveSlide(finalPosition);
  }

  // finaliza os eventListeners;
  onEnd() {
    this.wrapper.removeEventListener("mousemove", this.onMouseMove);
    this.dist.finalPosition = this.dist.movePosition
  }

  addSlideEventListener() {
    // o this desse está errado, para consertar usamos o bind
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
  }

  // altera o this dos métodos
  onBind() {
    this.onStart = this.onStart.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  init() {
    this.onBind();
    this.addSlideEventListener();
    

    return this;
  }
}
