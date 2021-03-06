'use strict';

var tkCountdown = new Object()

tkCountdown.begin = function(opts) {

  // if the mode is defined make sure it's visible
  if (typeof opts.mode !== 'undefined') {
    if (opts.mode == 'progress') {

      tkCountdown.element = document.querySelector('.tk-countdown.progress')
      tkCountdown.remainder = tkCountdown.element.querySelector('.remainder')
      tkCountdown.elapsed = tkCountdown.element.querySelector('.elapsed')
      tkCountdown.remainderLabel = tkCountdown.remainder.querySelector('.label')
      tkCountdown.elapsedLabel = tkCountdown.elapsed.querySelector('.label')

      // % remaining to initialise display (/1)
      if (typeof opts.startRatio === 'undefined') {
        opts.startRatio = 0.75
      } else {
        // set the initial state based on the requested ratio
        tkCountdown.remainder.style.width = (opts.startRatio * 100)+'%'
        tkCountdown.elapsed.style.width = (100-(opts.startRatio * 100))+'%'
      }
      opts.startRatio = opts.startRatio * 100
      tkCountdown.startRatio = opts.startRatio

    }
    else if (opts.mode == 'flip') {

      tkCountdown.element = document.querySelector('.tk-countdown.flip')
      tkCountdown.weeksDigit = document.querySelector('.tk-countdown .item.weeks .digit')
      tkCountdown.daysDigit = document.querySelector('.tk-countdown .item.days .digit')
      tkCountdown.hoursDigit = document.querySelector('.tk-countdown .item.hours .digit')
      tkCountdown.minutesDigit = document.querySelector('.tk-countdown .item.minutes .digit')
      tkCountdown.secondsDigit = document.querySelector('.tk-countdown .item.seconds .digit')
      tkCountdown.element.style.display = 'block'
      document.querySelector('.tk-countdown.progress').style.display = 'none'

    }
  } else {
    opts.mode = 'progress'
  }
  tkCountdown.mode = opts.mode

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
      console.warn('A frequency that is not a factor of 1000 milliseconds has been supplied ('+opts.frequency+'). This will result in irregular display updates.')
    }
    if (tkCountdown.mode == 'progress') {
      // set the transition time to match the update frequency
      tkCountdown.remainder.style.transitionDuration = opts.frequency+'ms'
      tkCountdown.elapsed.style.transitionDuration = opts.frequency+'ms'
    }
  }

  tkCountdown.startTime = new Date().getTime()
  // take the frequency off the start time because the first interval will run after that period
  tkCountdown.startTime -= opts.frequency

  // styles based on the containing element
  var container = tkCountdown.element.parentElement
  if (tkCountdown.mode == 'progress') {
    // get the element that the countdown is contained in and use it for dimensions
    var lineHeight = container.style.height
    tkCountdown.elapsedLabel.style.width = container.style.width
    tkCountdown.elapsedLabel.style.lineHeight = lineHeight
    tkCountdown.elapsedLabel.style.fontSize = (parseInt(container.style.height) * 0.6)+'px'
    tkCountdown.remainderLabel.style.width = container.style.width
    tkCountdown.remainderLabel.style.lineHeight = lineHeight
    tkCountdown.remainderLabel.style.fontSize = (parseInt(container.style.height) * 0.6)+'px'
  } else if (tkCountdown.mode == 'flip') {
    var labels = tkCountdown.element.querySelectorAll('.item .label')
    var values = tkCountdown.element.querySelectorAll('.item .value')
    var lineHeight = container.getBoundingClientRect().height
    for (var l = 0; l < labels.length; l++) labels[l].style.lineHeight = (lineHeight * 0.3)+'px'
    for (var v = 0; v < values.length; v++) values[v].style.lineHeight = (lineHeight * 0.7)+'px'
  }

  tkCountdown.interval = setInterval(function() {
    tkCountdown.render()
  }, opts.frequency)

}

tkCountdown.render = function() {
  if (tkCountdown.mode == 'progress') tkCountdown.renderProgress()
  else if (tkCountdown.mode == 'flip') tkCountdown.renderFlip()
}

tkCountdown.renderProgress = function() {

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
    tkCountdown.elapsedLabel.innerText = display.label
    tkCountdown.remainderLabel.innerText = display.label
  }

  tkCountdown.remainder.style.width = newRatio+'%'
  tkCountdown.elapsed.style.width = (100-newRatio)+'%'

}

tkCountdown.renderFlip = function() {

  var remainingTimeSpan = tkCountdown.eventTime - new Date().getTime()
  // we need to add a second so the final animation doesn't display 0s
  remainingTimeSpan += 1000

  if (remainingTimeSpan < 0) return clearInterval(tkCountdown.interval)

  // if the time span in seconds hasn't changed, don't run this expensive calculation
  if (parseInt(remainingTimeSpan / 1000) !== tkCountdown.currentSecondsTimeSpan) {
    var display = tkCountdown.display(remainingTimeSpan)

    if (tkCountdown.currentDisplay) {

      // flip those values that have changed by toggling the animate class
      if (tkCountdown.currentDisplay.weeks != display.weeks) tkCountdown.flipDigit(tkCountdown.weeksDigit, display.weeks)
      if (tkCountdown.currentDisplay.days != display.days) tkCountdown.flipDigit(tkCountdown.daysDigit, display.days)
      if (tkCountdown.currentDisplay.hours != display.hours) tkCountdown.flipDigit(tkCountdown.hoursDigit, display.hours)
      if (tkCountdown.currentDisplay.minutes != display.minutes) tkCountdown.flipDigit(tkCountdown.minutesDigit, display.minutes)
      if (tkCountdown.currentDisplay.seconds != display.seconds) tkCountdown.flipDigit(tkCountdown.secondsDigit, display.seconds)

    } else {
      // this is the first run, set all values
      tkCountdown.weeksDigit.querySelector('.front').innerText = display.weeks
      tkCountdown.weeksDigit.querySelector('.back').innerText = display.weeks
      tkCountdown.weeksDigit.querySelector('.hinge .front').innerText = display.weeks
      tkCountdown.weeksDigit.querySelector('.hinge .back').innerText = display.weeks

      tkCountdown.daysDigit.querySelector('.front').innerText = display.days
      tkCountdown.daysDigit.querySelector('.back').innerText = display.days
      tkCountdown.daysDigit.querySelector('.hinge .front').innerText = display.days
      tkCountdown.daysDigit.querySelector('.hinge .back').innerText = display.days

      tkCountdown.hoursDigit.querySelector('.front').innerText = display.hours
      tkCountdown.hoursDigit.querySelector('.back').innerText = display.hours
      tkCountdown.hoursDigit.querySelector('.hinge .front').innerText = display.hours
      tkCountdown.hoursDigit.querySelector('.hinge .back').innerText = display.hours

      tkCountdown.minutesDigit.querySelector('.front').innerText = display.minutes
      tkCountdown.minutesDigit.querySelector('.back').innerText = display.minutes
      tkCountdown.minutesDigit.querySelector('.hinge .front').innerText = display.minutes
      tkCountdown.minutesDigit.querySelector('.hinge .back').innerText = display.minutes

      tkCountdown.secondsDigit.querySelector('.front').innerText = display.seconds
      tkCountdown.secondsDigit.querySelector('.back').innerText = display.seconds
      tkCountdown.secondsDigit.querySelector('.hinge .front').innerText = display.seconds
      tkCountdown.secondsDigit.querySelector('.hinge .back').innerText = display.seconds
    }

    tkCountdown.currentDisplay = display

    // change front to new value
    // change hinge.back to new value
    // animate
    // change back to new value
    // change hinge.front to new value

  }

}

tkCountdown.flipDigit = function(digit, value) {
  digit.classList.add('reverse-animate')
  digit.classList.remove('animate')
  setTimeout(function() {
    (function(digit, value) {
      digit.classList.add('animate')
      digit.classList.remove('reverse-animate')
      digit.querySelector('.back').innerText = value
      digit.querySelector('.front').innerText = value
      digit.querySelector('.hinge .back').innerText = value
      digit.querySelector('.hinge .front').innerText = value
    })(digit, value)
  }, 20)
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

  return {
    weeks: weeks,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    label: weeks+'w '+days+'d '+hours+'h '+minutes+'m '+seconds+'s'
  }
}

// RUN THIS FROM YOUR APPLICATION
// tkCountdown.begin({
//   // demo: 65000,
//   eventTime: new Date('2017-11-23T16:00:00').getTime(),
//   frequency: 125,
//   startRatio: 0.8,
//   mode: 'flip'
// })
