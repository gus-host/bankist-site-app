'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');
const imgTargets = document.querySelectorAll('img[data-src');
const navMenu = document.querySelector('.icon-menu');
const navclose = document.querySelector('.icon-cross');
const navLinks = document.querySelector('.nav__links');
const form = document.querySelector('.modal__form');
const firstName = document.querySelector('.first__name');
const lastName = document.querySelector('.last__name');
const email = document.querySelector('.email');
const body = document.querySelector('body');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////////////////////////////
// IMPLEMENTING SMOOTH SCROLLING

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  // ->x and left are distances from left side of section1 to the left side of the viewport
  // ->y and top are distances from top side of section1 to the top of the viewport
  console.log(s1coords); //DOMRect {x: 0, y: 304.8888854980469, width: 897.7777709960938, height: 1652.5833740234375, top: 304.8888854980469, bottom:1956.5833740234375}

  console.log(e.target.getBoundingClientRect()); // e.target -> btnScrollTo,

  console.log('Current scroll (X/Y', window.pageXOffset, window.pageYOffset); // distance of left and top side of view port to left and top side of page

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  ); // height and width of viewport

  //Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // ); // scrooll from top of the page to section 1

  //------old way of smooth scroll
  // window.scrollTo({
  //   left: window.pageXOffset + s1coords.left,
  //   top: window.pageYOffset + s1coords.top,
  //   behavior: 'smooth',
  // });

  //-----new way-------
  section1.scrollIntoView({ behavior: 'smooth' });
});

/////////////////////////////////////////////////
// Page navigation

/*
document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();

    const id = this.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});
*/

// EVENT DELEGATION
//  1. Add event listener to common parent element
//  2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault(); // prevent reload of page

  // -------matching Strategy--------
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    if (id === '#') return;
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// BUILDING A TABBED COMPONENT - 1
const activateTab = function (e) {
  const clicked = e.target.closest(`.${this[0]}`);
  const tabIconConts = e.target
    .closest('.operations__tab-container')
    .querySelectorAll('.tab__icon__cont');
  // ------- to get the tab element always whether click on tab button or its children element -----------
  // if (e.target.classList.contains('operation_tab')) {
  //   console.log(e.target);
  // } else e.target.closest('button') && console.log(e.target.closest('button'));
  // console.log(clicked);

  // ------Guard clause-----
  if (!clicked) return; // return nothing if an area on tabContainer was clicked rather than any of the buttons

  // ------remove active classes--------
  const tabArr = new Array(
    ...(clicked.classList.contains('operations__tab') ? tabs : tabIconConts)
  );
  tabArr.forEach(t => t.classList.remove(`${this[1]}`));

  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // ------activate tab------
  // 'tab__icon__cont' 'operations__tab'

  tabArr.forEach(t => {
    if (t === clicked) clicked.classList.add(`${this[1]}`);
  });

  // --------activate content area--------
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`) // using the data-tab attribute on clicked element to select the element to activate
    .classList.add('operations__content--active');
};

const desktopTab = activateTab.bind([
  'operations__tab',
  'operations__tab--active',
]);

tabsContainer.addEventListener('click', desktopTab);

// PASSING ARGUMENTS TO EVENT HANDLERS
// --------Menu fade animation----------
// const handleHover = function (e, opacity) {
const handleHover = function (e) {
  // should have only one argument

  //----note that this == e.currentTarget == nav----
  // -----matching strategy
  if (e.target.classList.contains('nav__link')) {
    const link = e.target; // navLink that generated the event
    const siblings = link.closest('.nav').querySelectorAll('.nav__link'); // all navLinks
    const logo = link.closest('.nav').querySelector('img'); // logo image

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this; // or opacity;
    }); // set opacity of all navLinks except the one hovered
    logo.style.opacity = this; // or opacity; // set opacity of logo
  }
};

// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// }); // use mouseover not mouseenter for event bubbling

// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });

// --------using the bind method---------
nav.addEventListener('mouseover', handleHover.bind(0.5)); // setting 'this' to opacity
nav.addEventListener('mouseout', handleHover.bind(1));

// IMPLEMENTING A STICKY NAVIGATION: THE SCROLL EVENT

// -------Never use the scroll event----------
/*
const initialCoords = section1.getBoundingClientRect();

window.addEventListener('scroll', function () {
  console.log(window.scrollY); // returns distance from top of viewport to top of the page

  if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});

*/

// A BETTER WAY: THE INTERSECTION OBSERVER API

// ---Intersection Observer Api -> helps to observe changes on how a target element intersect another element or viewport-------

/*
const obsCallback = function (entries, observer) {
  entries.forEach(entry => {
    //entries are an array of threshold entries
    console.log(entry);
  });
};

const obsOptions = {
  root: null, // viewport by default(null) -> N.B 'root' is the element(root element) we want to intersect the target el
  threshold: 0.1, // percentage of element that needs to be visible before the callback is invoked -> happens when when entering and leaving the observed element

  // threshold: [0, 0.2], // trigger callback at each threshold in array

  // threshold: 1 // trigger callback at when 100% of observed element is intersected -> happens only once

  // threshold: 0 // trigger callback at when 0% of observed element is intersected i.e at the end of observed element-> happens only once
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1); // observe section1 element -> target element

*/

const navHeight = nav.getBoundingClientRect().height; // get height of nav element

const stickyNav = function (entries) {
  // callback function
  const [entry] = entries; // also can be written as entries[0]

  console.log(entry);
  if (entry.isIntersecting === false) body.classList.add('sticky');
  else body.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// REVEALING ELEMENTS ON SCROLL
const allSections = document.querySelectorAll('section');

// -------callback function----------
const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); //entry.target is the element that is intersecting the root element
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// LAZY LOADING IMAGES
const loading = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return; // return nothing if intersection of view port and img is false

  //--------replacing src with data-src----------
  entry.target.src = entry.target.dataset.src; // changing value of the source emits the load event

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img'); // remove lazy-img class after loading img
  });
  // entry.target.classList.remove('lazy-img');

  observer.unobserve(entry.target); // stop observing the image after load event
};

const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const sliderFunc = function () {
  // BUILDING A SLIDER COMPONENT - 1

  let curSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  const goToSlide = function (curSlide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - curSlide)}%)`)
    );
  };

  //0% 100% 200% 300%

  // -------next slide--------
  const slide = function () {
    this[0] === slides.length ? curSlide++ : curSlide--;
    if (curSlide === this[0]) curSlide = this[1];

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const nextSlide = slide.bind([slides.length, 0]);
  const prevSlide = slide.bind([-1, slides.length - 1]);
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // BUILDING A SLIDER COMPONENT - 2 -> Making the dots work

  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  function activateDot(slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  }

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(curSlide);
  };

  init();

  document.addEventListener('keydown', function (e) {
    // console.log(e.key);
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);

      activateDot(slide);
    }
  });

  let int = setInterval(nextSlide, 4000);
  document.querySelector('.slider').addEventListener('mousedown', function () {
    clearInterval(int);
  });
  document.querySelector('.slider').addEventListener('mouseup', function () {
    int = setInterval(nextSlide, 4000);
  });
};

sliderFunc();

// ----Navigation menu---------

const navFunc = function () {
  if (this === navMenu) navLinks.classList.add('nav__links__active');
  else if (this === navclose) navLinks.classList.remove('nav__links__active');

  this.style.display = 'none';
  document.querySelector(`.icon-${this.dataset.nav}`).style.display =
    'inline-block';
};
navMenu.addEventListener('click', navFunc);
navclose.addEventListener('click', navFunc);
navLinks.addEventListener('click', function (e) {
  if (e.target.classList.contains('nav__link')) {
    const parentNav = e.target.closest('.nav');
    parentNav
      .querySelectorAll('.nav__link')
      .forEach(linkLogo => (linkLogo.style.opacity = 1));
    parentNav.querySelector('img').style.opacity = 1;

    navLinks.classList.remove('nav__links__active');

    navMenu.style.display = 'inline-block';
    navclose.style.display = 'none';
  }
});

// BUILDING A TABBED COMPONENT - 2
tabs.forEach(function (tab, i) {
  tabsContainer.insertAdjacentHTML(
    'beforeend',
    `<div class="tab__icon__cont tab__icon__cont--${i + 1}" data-tab="${i + 1}">
     <div class="operations__icon operations__icon--${i + 1}">
   <svg>
     <use xlink:href="img/icons.svg#icon-${tab.dataset.icon}"></use>
   </svg>
  </div>
  </div>`
  );

  if (i === 0)
    document
      .querySelector(`.tab__icon__cont--${i + 1}`)
      .classList.add('tab__icon__active');
});

const mobileTab = activateTab.bind(['tab__icon__cont', 'tab__icon__active']);

tabsContainer.addEventListener('click', mobileTab);

// submitting form
form.addEventListener('submit', function (e) {
  e.preventDefault();

  console.log();
  const formData = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
  };

  // Store form data (for example, in localStorage)
  localStorage.setItem('formData', JSON.stringify(formData));

  // Navigate to the specified URL
  window.location.href = '/bankist-app/index.html';
});

///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////

// lectures
/* 
// SELECTING CREATING AND DELETING ELEMENTS

// Selecting element
console.log(document.documentElement); // Select root element (html)
console.log(document.head); // Select head element
console.log(document.body); // Select body element

const header = document.querySelector('.header'); // Select first element with class 'header'
const allSections = document.querySelectorAll('.section');
console.log(allSections); // select all sections into a nodelist

document.getElementById('section--1'); // Select element with id 'section--1'
const allButtons = document.getElementsByTagName('button');
console.log(allButtons); // Select all button elements into a HTML collection

console.log(document.getElementsByClassName('btn')); // Select all button elements into a HTML collection

// Creating and inserting elements

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics.';
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message) // Add message to header at top
header.append(message); // Add message to header element at bottom
// header.append(message.cloneNode(true)); // Clone message and add it to header at bottom

// header.before(message); // Add message to header element before header
// header.after(message); // Add message to header element after header

// Delete Elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    setTimeout(() => message.remove(), 500);
    // message.parentElement.removeChild(message)
  });

// STYLES, ATTRIBUTES AND CLASSES

// styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color); // return empty because color is not an inline style
console.log(message.style.backgroundColor); // rgb(55, 56, 61) -> backgroundColor is an inline style

console.log(getComputedStyle(message).color); // return actual color value -> rgb(187, 187, 187)
console.log(getComputedStyle(message).height); // 49px

message.style.height = Number.parseFloat(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered'); // using setProperty to change style of css variable

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt); // Bankist logo
console.log(logo.className); // nav__logo

logo.alt = 'Beautiful minimalist logo'; // changes old alt value

//--------non-standard-----
console.log(logo.designer); // undefined
console.log(logo.getAttribute('designer')); // jonas
logo.setAttribute('company', 'Bankist'); // adds new attribute

console.log(logo.src); // http://127.0.0.1:8080/img/logo.png -> absolute url
console.log(logo.getAttribute('src')); // img/logo.png -> relative url

const link = document.querySelector('.nav__link--btn');
console.log(link.href); // http://127.0.0.1:8080/#
console.log(link.getAttribute('href')); // #

// ------data attributes-----
console.log(logo.dataset.versionNumber); // 3.0

// ------classes-------
console.log(logo.classList.add('c', 'j'));
console.log(logo.classList.remove('c', 'j'));
console.log(logo.classList.toggle('c'));
console.log(logo.classList.contains('c')); //includes like in arrays

// ----don't use---
logo.className = 'jonas'; // removes other class names and set it to jonas ONLY


// TYPES OF EVENTS AND EVENT HANDLERS

const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: Great! You are reading the heading :D');
  // h1.removeEventListener('mouseenter', alertH1) // makes the mouseenter event happen only once
};

h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);// removes event after 3 secs

// h1.onmouseenter = function (e) {
//   alert('addEventListener: Great! You are reading the heading :D');
// }; // old way of adding event listener with onproperty



// EVENT PROPAGATION IN PRACTICE
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  // NB: e.target => element the event happen on, here nav__link, and not the element with the event handeler
  // e.currentTarget however refers to the element to which the event handler was attached
  
  console.log('LINK', e.target, e.currentTarget);
  console.log(this === e.currentTarget);
  
  // e.stopPropagation(); // stops the event from bubbling up
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  // NB: e.target => element the event (i.e click event) happen on, here nav__links, and not the element with the event handeler
  // e.currentTarget however refers to the element to which the event handler was attached
  
  console.log('CONTAINER', e.target, e.currentTarget);
});
document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    // NB: e.target => element the event happen on, here nav__link, and not the element with the event handeler
    // e.currentTarget however refers to the element to which the event handler was attached

    console.log('NAV', e.target, e.currentTarget);
  },
  true // capture phase instead of bubble phase, causes this event to happen first before children
  // event-tree -> nav (capture phase) -> nav__link (target phase) -> nav__link(bubble phase)
);


// DOM TRAVERSING -> moving up, down and side ways in the dom tree

const h1 = document.querySelector('h1');

// -------going downwards: child----------
console.log(h1.querySelectorAll('.highlight')); // NodeList(2) [span.highlight, span.highlight]
console.log(h1.childNodes); // return all child nodes of h1 -> NodeList(9) [text, comment, text, span.highlight, text, br, text, span.highlight, text]
console.log(h1.children); // return only element child nodes of h1 -> HTMLCollection(3) [span.highlight, br, span.highlight]
h1.firstElementChild.style.color = 'whitesmoke'; // change color of first element child of h1
h1.lastElementChild.style.color = 'coral'; // change color of last element child of h1

// -------going upwards: parent----------
console.log(h1.parentNode); //return the parent node of h1 -> div El, class name: header__title
console.log(h1.parentElement); // return div El, class name: header__title

h1.closest('.header').style.background = 'var(--gradient-secondary)'; // sets the backgroundColor of the immediate parent element of h1 with className 'header' to var (--gradient-secondary)
h1.closest('h1').style.background = 'var(--gradient-primary)'; // sets the backgroundColor of h1 to var (--gradient-secondary)

// -------going sodways: siblings----------
console.log(h1.previousElementSibling); // null -> no previous sibling
console.log(h1.nextElementSibling); // <h4>A simpler banking experience for a simpler life.</h4>

console.log(h1.previousSibling); // previous nodelist sibling
console.log(h1.nextSibling); // next nodelist sibling

console.log(h1.parentElement.children); // gets all siblings of parent(header) -> HTMLCollection(4) [h1, h4, button.btn--text.btn--scroll-to, img.header__img]
[...h1.parentElement.children].forEach(function (el, i) {
  if (el !== h1) el.style.transform = 'scale(0.5';
});

// LIFECYCLE DOM EVENTS
// ----------Domcontentloaded--------------
// fires only after the html and JavaScript scrips have been loaded -> no neeed to be used if javascript element is the last element in the body lelement in HTML
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTMl parsed and Dom tree built!', e);
});

// ------load---------
// fires after complete page has been loaded including images and external scripts

window.addEventListener('load', function (e) {
  console.log('page fully loaded!', e);
});

// --------beforeunload--------
// fires when the browser tab is about to be closed
// window.addEventListener('beforeunload', function (e) {
  //   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });

*/
