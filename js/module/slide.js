export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);

    this.dist = { finalPosition: 0, startX: 0, moviment: 0 };
  }

  // pega a primeira posição do mouse e chama a event de mover o mouse(mousemove);
  onStart(event) {
    let moveEvent;

    if (event.type === "mousedown") {
      event.preventDefault();
      this.dist.startX = event.clientX;
      moveEvent = "mousemove";
      
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      moveEvent = "touchmove";
    }

    this.wrapper.addEventListener(moveEvent, this.onMouseMove);
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
    const pointerPosition =
      (event.type === "mousemove") ? event.clientX : event.changedTouches[0].clientX;

    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  // finaliza os eventListeners;
  onEnd(event) {
    console.log(event);
    const eventType = (event.typer === 'mouseup') ? 'mousemove' : 'touchmove';

    this.wrapper.removeEventListener(eventType, this.onMouseMove);
    this.dist.finalPosition = this.dist.movePosition;
  }

  addSlideEventListener() {
    // o this desse está errado, para consertar usamos o bind
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
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
