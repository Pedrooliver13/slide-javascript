import debounce from "./debounce.js";

export class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = { finalPosition: 0, startX: 0, moviment: 0 };
    this.activeClass = "active";
    this.changeEvent = new Event('changeEvent'); // criamos um event, com constructor de Events.
  }

  transition(active) {
    this.slide.style.transition = active ? "transform .3s ease" : "";
  }

  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  // 6º atualiza a posição do slide;
  updatePosition(clientX) {
    this.dist.moviment = (this.dist.startX - clientX) * 1.6;
    return this.dist.finalPosition - this.dist.moviment;
  }

  // 4º pega a primeira posição do mouse e chama a event de mover o mouse(mousemove);
  onStart(event) {
    let movetype;

    if (event.type === "mousedown") {
      event.preventDefault();
      this.dist.startX = event.clientX;
      movetype = "mousemove";
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      movetype = "touchmove";
    }

    this.wrapper.addEventListener(movetype, this.onMouseMove);
    this.transition(false);
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
    const movetype = event.type === "mouseup" ? "mousemove" : "touchmove";

    this.wrapper.removeEventListener(movetype, this.onMouseMove);
    this.dist.finalPosition = this.dist.movePosition;
    this.transition(true);
    this.changeSlideOnEnd();
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

  // 2º adiciona os events.
  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
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

    this.dist.finalPosition = activeSlide.position;
    this.changeActiveClass();
    this.wrapper.dispatchEvent(this.changeEvent); // para ele dispara o event, toda vez que essa função for ativada;
  }

  changeActiveClass() {
    this.slideArray.forEach((element) =>
      element.item.classList.remove(this.activeClass)
    );
    
    this.slideArray[this.index.active].item.classList.add(this.activeClass);
  }

  activePrevSlide() {
    if (this.index.prev !== undefined) this.changeSlide(this.index.prev);
  }

  activeNextSlide() {
    if (this.index.next !== undefined) this.changeSlide(this.index.next);
  }

  onResize() {
    setTimeout(() => {
      this.slideConfig();
      this.changeSlide(this.index.active);
    }, 1000);
  }

  addResizeEvent() {
    window.addEventListener('resize', this.onResize);
  }
 
  // 3º altera o this dos métodos
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onEnd = this.onEnd.bind(this);

    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);

    this.onResize = debounce(this.onResize.bind(this), 200);
  }

  init() {
    this.bindEvents();
    this.transition(true);
    this.slideConfig();
    this.addSlideEvents();
    this.changeSlide(2);
    this.addResizeEvent();

    return this;
  }
}

export class SlideNav extends Slide {
  constructor(slide, wrapper) {
    super(slide, wrapper);
    this.bindControlEvents();
  }

  // adiciona botão de navegação. (opcional)
  addArrow(prev, next) {
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);
    this.addArrowEvent();
  }

  addArrowEvent() {
    this.prevElement.addEventListener("click", this.activePrevSlide);
    this.nextElement.addEventListener("click", this.activeNextSlide);
  }

  // cria os controls e adiciona ao html;
  createControls() {
    const control = document.createElement('ul');
    control.dataset.slide = 'control';

    this.slideArray.forEach((item, index) => {
      control.innerHTML += `<li><a href="#slide${index + 1}">${index + 1}</a></li>`
    });

    this.wrapper.appendChild(control);
    return control;
  }

  // adiciona o event ao itens do control;
  eventControl(item, index) {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      this.changeSlide(index);
      this.activeControlItem();
    });

    this.wrapper.addEventListener('changeEvent', this.activeControlItem);
  }

  activeControlItem() {
    this.controlArray.forEach((item) => item.classList.remove(this.activeClass));
    this.controlArray[this.index.active].classList.add(this.activeClass);
  }

  addControl(customControl) {
    this.control = document.querySelector(customControl) || this.createControls();
    this.controlArray = [...this.control.children];

    // quando os parametros são igual, ele entende e passa o valor automaticamente. 
    this.activeControlItem();
    this.controlArray.forEach(this.eventControl); 
  }

  bindControlEvents() {
    this.activeControlItem = this.activeControlItem.bind(this);
    this.eventControl = this.eventControl.bind(this);
  }
}
