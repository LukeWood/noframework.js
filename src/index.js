// Selectors

/**
 *
 * @param {String} selector
 * @param {Node} element
 *
 * @return {Node}
 */

const $ = (selector, element = document) => element.querySelector(selector);

/**
 *
 * @param {String} selector
 * @param {Node} element
 *
 * @return {NodeList}
 */
const $$ = (selector, element = document) => Array.from(element.querySelectorAll(selector));


// templating

/**
 *
 * @param {String} text
 *
 * @return {Node}
 */
const html = (text, ...stuff) => {
  let ht = '';
  text.forEach((part, index) => {
    if (!(stuff[index] instanceof Node)) {
      ht += stuff[index] ? part + stuff[index] : part;
    } else {
      ht += stuff[index] ? `${part}<temp temp-id='${index}'></temp>` : part;
    }
  });
  const template = document.createElement('template');
  template.innerHTML = ht.trim();
  const style = $('style', template.content);
  if (style) {
    html.style.textContent += style.textContent.trim();
  }
  const ret = template.content.firstChild;
  ret.statics = {};
  ret.events = {};
  $$('temp', ret).forEach((e) => {
    const id = parseInt(e.getAttribute('temp-id'), 10);
    const target = stuff[id];
    e.parentNode.replaceChild(target, e);
  });
  return ret;
};

html.style = document.createElement('style');
document.head.appendChild(html.style);

// EventManager

class EventManager {
  constructor() {
    this.events = {};
  }

  /**
   *
   * @param {String} eventName
   * @param {Function} callback
   */

  unsuscribe(eventName, callback) {
    this.events[eventName] = this.events[eventName].filter(e => e !== callback);
  }

  /**
   *
   * @param {String} eventName
   * @param {Function} callback
   */

  suscribe(eventName, callback) {
    this.events[eventName] = this.events[eventName] ? this.events[eventName] : [];
    this.events[eventName].push(callback);
  }

  /**
   *
   * @param {String} eventName
   */
  clearEvent(eventName) {
    delete this.events[eventName];
  }

  /**
   *
   * @param {String} eventName
   * @param {any} params
   */


  emit(eventName, ...params) {
    this.events[eventName] = this.events[eventName] ? this.events[eventName] : [];
    this.events[eventName].forEach((callback) => {
      callback(...params);
    });
  }
}

// event helpers

/**
 *
 * @param {Number} keyCode
 * @return {Function}
 *
 */

const only = keyCode => fn => (evt) => {
  if (evt.keyCode === keyCode) {
    fn(evt);
  }
};

const backspace = only(8);
const tab = only(9);
const enter = only(13);
const shift = only(16);
const ctrl = only(17);
const alt = only(18);
const esc = only(27);
const left = only(37);
const up = only(38);
const right = only(39);
const down = only(40);


// other

/**
 *
 * @param {Node} element Element to scroll
 * @param {Number} to height to scroll to
 * @param {Number} duration duration in ms
 */

const smoothScrollTo = (element, to, duration) => {
  const start = element.scrollTop;
  const change = to - start;
  const startDate = +new Date();

  const easeInOutQuad = (t, b, c, d) => {
    // eslint-disable-next-line no-param-reassign
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    // eslint-disable-next-line no-param-reassign
    t -= 1;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };
  const animateScroll = () => {
    const currentDate = +new Date();
    const currentTime = currentDate - startDate;
    // eslint-disable-next-line no-param-reassign
    element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration), 10);
    if (currentTime < duration) {
      requestAnimationFrame(animateScroll);
    } else {
      // eslint-disable-next-line no-param-reassign
      element.scrollTop = to;
    }
  };
  animateScroll();
};

// Date

/**
 *
 * @param {Date} d1
 * @param {Date} d2
 *
 * @return {Boolean}
 */
const sameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear()
    && d1.getMonth() === d2.getMonth()
    && d1.getDate() === d2.getDate();

/**
 * @param {Date} d the Date
 * @return {Date[]} List with date objects for each day of the month
 */
const getDaysInMonth = (d = new Date()) => {
  const month = d.getMonth();
  const year = d.getFullYear();
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};


module.exports = {
  $,
  $$,
  html,
  EventManager,
  smoothScrollTo,
  only,
  KEYS: {
    backspace,
    tab,
    enter,
    shift,
    ctrl,
    alt,
    esc,
    left,
    up,
    right,
    down,
  },
  DATE: {
    sameDay,
    getDaysInMonth,
  },
};
