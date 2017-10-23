/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var tkCountdown = new Object()

tkCountdown.begin = function(opts) {

  tkCountdown.element = document.querySelector('#tk-countdown')
  tkCountdown.remainder = tkCountdown.element.querySelector('.remainder')
  tkCountdown.elapsed = tkCountdown.element.querySelector('.elapsed')
  tkCountdown.remainderLabel = tkCountdown.remainder.querySelector('.label')
  tkCountdown.elapsedLabel = tkCountdown.elapsed.querySelector('.label')

  // % remaining to initialise display (/1)
  if (typeof opts.startRatio === 'undefined') {
    opts.startRatio = 0.75
  } else {
    // set the initial state based on the requested ratio
    tkCountdown.remainder.style.width = `${opts.startRatio * 100}%`
    tkCountdown.elapsed.style.width = `${100-(opts.startRatio * 100)}%`
  }
  opts.startRatio = opts.startRatio * 100
  tkCountdown.startRatio = opts.startRatio

  if (typeof opts.demo != 'undefined') {
    tkCountdown.eventTime = new Date().getTime() + opts.demo
  } else {
    tkCountdown.eventTime = opts.eventTime
  }

  // frequency at which to update the countdown display (ms)
  if (typeof opts.frequency === 'undefined') {
    opts.frequency = 125
  } else {
    if (1000 % opts.frequency != 0) {
      console.warn(`A frequency that is not a factor of 1000 milliseconds has been supplied (${opts.frequency}). This will result in irregular display updates.`)
    }
    // set the transition time to match the update frequency
    tkCountdown.remainder.style.transitionDuration = `${opts.frequency}ms`
    tkCountdown.elapsed.style.transitionDuration = `${opts.frequency}ms`
  }

  tkCountdown.startTime = new Date().getTime()
  // take the frequency off the start time because the first interval will run after that period
  tkCountdown.startTime -= opts.frequency

  // get the element that the countdown is contained in and use it for dimensions
  var container = tkCountdown.element.parentElement
  tkCountdown.elapsedLabel.style.width = container.style.width
  tkCountdown.elapsedLabel.style.lineHeight = container.style.height
  tkCountdown.elapsedLabel.style.fontSize = `${parseInt(container.style.height) * 0.6}px`
  tkCountdown.remainderLabel.style.width = container.style.width
  tkCountdown.remainderLabel.style.lineHeight = container.style.height
  tkCountdown.remainderLabel.style.fontSize = `${parseInt(container.style.height) * 0.6}px`

  tkCountdown.interval = setInterval(function() {
    tkCountdown.render()
  }, opts.frequency)

}

tkCountdown.render = function() {

  // display began at startRatio / startTime so:
  //      eventTime - startTime = startRatio
  // update display such that:
  //      eventTime - currentTime / (eventTime - startTime) * startRatio
  var newRatio = ((tkCountdown.eventTime - new Date().getTime()) / (tkCountdown.eventTime - tkCountdown.startTime)) * tkCountdown.startRatio
  if (newRatio < 0) {
    newRatio = 0
    clearInterval(tkCountdown.interval)
  }

  var remainingTimeSpan = tkCountdown.eventTime - new Date().getTime()
  // we need to add a second so the final animation doesn't display 0s
  remainingTimeSpan += 1000

  // if the time span in seconds hasn't changed, don't run this expensive calculation
  if (parseInt(remainingTimeSpan / 1000) !== tkCountdown.currentSecondsTimeSpan) {
    var display = tkCountdown.display(remainingTimeSpan)
    tkCountdown.elapsedLabel.innerText = display
    tkCountdown.remainderLabel.innerText = display
  }

  tkCountdown.remainder.style.width = `${newRatio}%`
  tkCountdown.elapsed.style.width = `${100-newRatio}%`

}

tkCountdown.display = function(ms) {

  // store the time span in seconds so we can ensure it's changed before the expensive calculation
  tkCountdown.currentSecondsTimeSpan = parseInt(ms / 1000)

  var seconds = (ms / 1000) | 0
  ms -= seconds * 1000

  var minutes = (seconds / 60) | 0
  seconds -= minutes * 60

  var hours = (minutes / 60) | 0
  minutes -= hours * 60

  var days = (hours / 24) | 0
  hours -= days * 24

  var weeks = (days / 7) | 0
  days -= weeks * 7

  return `${weeks}w ${days}d ${hours}h ${minutes}m ${seconds}s`
}

tkCountdown.begin({
  demo: 10000,
  // eventTime: new Date('2017-10-28 08:00:00').getTime(),
  frequency: 125,
  startRatio: 0.8
})


/***/ })
/******/ ]);