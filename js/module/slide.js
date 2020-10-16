import debounce from './debounce.js';

export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);

    this.dist = { finalPosition: 0, startX: 0, moviment: 0 };
    this.activeClass = 'active';
  }

  // 4º pega a primeira posição do mouse e chama a event de mover o mouse(mousemove);
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
    this.transition(false);
  }

  // 6º responsável por mover o slide pelo style;
  moveSlide(distX) {
    this.dist.movePosition = distX; // posição final;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  // 6º atualiza a posição do slide;
  updatePosition(clientX) {
    this.dist.moviment = (this.dist.startX - clientX) * 1.6;
    return this.dist.finalPosition - this.dist.moviment;
  }

  // 5º event de mousemove. reponsavel por chamar as demais.
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
    this.transition(true);
    this.changeSlideOnEnd();
  }

  changeActiveClass() {
    this.slideArray.forEach(element => element.item.classList.remove(this.activeClass));

    this.slideArray[this.index.active].item.classList.add(this.activeClass);
  }

  transition(active) {
    this.slide.style.transition = active ? "transform .3s ease" : "";
  }

  changeSlideOnEnd() {
    if (this.dist.moviment > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if (this.dist.moviment < -120 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }

  // 2º³ vai posicionar ao centro
  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;

    return -(slide.offsetLeft - margin);
  }

  // 2º² vai configurar o slide, passando ele uma array conseguimos editar eles.
  slideConfig() {
    this.slideArray = [...this.slide.children].map((item) => {
      const position = this.slidePosition(item);
      return { position, item };
    });
  }

  // 7º pega o index do slide, para isso funcionar temos que transformar ele(itens do slide) um array
  slideIndexNav(index) {
    const last = this.slideArray.length - 1;

    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }

  // 7º muda o slide de acordo com seu index;
  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slideIndexNav(index);
    this.changeActiveClass();

    this.dist.finalPosition = activeSlide.position;
  }

  // muda o slide para o anterior
  activePrevSlide() {
    if (this.index.prev !== undefined) this.changeSlide(this.index.prev);
  }
  activeNextSlide() {
    if (this.index.active !== undefined) this.changeSlide(this.index.next);
  }

  onResize(){
    setTimeout(() => {
      this.slideConfig();
      this.changeSlide(this.index.active);
    }, 1000);
  }

  addResizeListener() {
    window.addEventListener('resize', this.onResize);
  }

  // 2º adiciona os events.
  addSlideEventListener() {
    // o this desse está errado, para consertar usamos o bind
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
  }

  // 3º altera o this dos métodos
  onBind() {
    this.onStart = this.onStart.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 200);
  }

  init() {
    this.onBind();
    this.addSlideEventListener();
    this.addResizeListener();
    this.slideConfig();

    return this;
  }
}
