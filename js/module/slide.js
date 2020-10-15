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
      event.type === "mousemove"
        ? event.clientX
        : event.changedTouches[0].clientX;

    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  // finaliza os eventListeners;
  onEnd(event) {
    const moveEvent = event.type === "mouseup" ? "mousemove" : "touchmove";

    this.wrapper.removeEventListener(moveEvent, this.onMouseMove);
    this.dist.finalPosition = this.dist.movePosition;
  }

  // adiciona os events.
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

  // vai posicionar ao centro
  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;

    return -(slide.offsetLeft - margin);
  }

  // vai configurar o slide, passando ele uma array conseguimos editar eles.
  slideConfig() {
    this.slideArray = [...this.slide.children].map((item) => {
      const position = this.slidePosition(item);
      return { position, item };
    });
  }

  slideIndexNav(index) {
    const last = this.slideArray.length - 1;

    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }

  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide);
    this.slideIndexNav(index);

    this.dist.finalPosition = activeSlide;
  }

  init() {
    this.onBind();
    this.addSlideEventListener();
    this.slideConfig();

    return this;
  }
}
