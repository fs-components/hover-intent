/*!
 * hoverIntent r7 // 2013.03.11 // jQuery 1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2013 Brian Cherne
 */

/* converted to use components and not jQuery by Jared Forsyth, 2013.06.06 */

var extend = require('extend')
  , mouseInOut = require('mouse-inout')
  , events = require('event');
 
/* hoverIntent is similar to jQuery's built-in "hover" method except that
 * instead of firing the handlerIn function immediately, hoverIntent checks
 * to see if the user's mouse has slowed down (beneath the sensitivity
 * threshold) before firing the event. The handlerOut function is only
 * called after a matching handlerIn.
 *
 * // basic usage ... just like .hover()
 * hoverIntent( element, handlerIn, handlerOut )
 * hoverIntent( element, handlerInOut )
 *
 * // using a basic configuration object
 * hoverIntent( element, config )
 *
 * @param  element     an element or list of elements
 * @param  handlerIn   function OR configuration object
 * @param  handlerOut  function OR undefined
 * @author Brian Cherne <brian(at)cherne(dot)net>
 */
module.exports = function (element, handlerIn, handlerOut) {
  // default configuration values
  var cfg = {
    interval: 100,
    sensitivity: 7,
    timeout: 0
  };

  if ( typeof handlerIn === "object" ) {
    cfg = extend(cfg, handlerIn );
  } else if (typeof(handlerOut) === 'function') {
    cfg = extend(cfg, { over: handlerIn, out: handlerOut } );
  } else {
    cfg = extend(cfg, { over: handlerIn, out: handlerIn } );
  }

  if (element.length) {
    for (var i=0; i<element.length; i++) {
      hoverIntent(element[i], cfg);
    }
  } else {
    hoverIntent(element, cfg);
  }
}

function hoverIntent(element, cfg) {

  // instantiate variables
  // cX, cY = current X and Y position of mouse, updated by mousemove event
  // pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
  var cX, cY, pX, pY, timeout, state;

  // A private function for getting mouse position
  var track = function(ev) {
    cX = ev.pageX;
    cY = ev.pageY;
  };

  // A private function for comparing current and previous mouse position
  var compare = function(ev, ob) {
    timeout = clearTimeout(timeout);
    // compare mouse positions to see if they've crossed the threshold
    if ( ( Math.abs(pX-cX) + Math.abs(pY-cY) ) < cfg.sensitivity ) {
      events.unbind(ob, "mousemove", track);
      // set hoverIntent state to true (so mouseOut can be called)
      state = 1;
      return cfg.over.apply(ob, [ev]);
    } else {
      // set previous coordinates for next time
      pX = cX; pY = cY;
      // use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
      timeout = setTimeout( function(){compare(ev, ob);} , cfg.interval );
    }
  };

  // A private function for delaying the mouseOut function
  var delay = function(ev, ob) {
    timeout = clearTimeout(timeout);
    state = 0;
    return cfg.out.apply(ob, [ev]);
  };

  var handleEnter = function(e) {
    // copy objects to be passed into t (required for event object to be passed in IE)
    var ev = extend({}, e);
    var ob = this;

    // cancel hoverIntent timer if it exists
    if (timeout) { timeout = clearTimeout(timeout); }

    // set "previous" X and Y position based on initial entry point
    pX = ev.pageX; pY = ev.pageY;
    // update "current" X and Y position based on mousemove
    events.bind(ob, "mousemove", track);
    // start polling interval (self-calling timeout) to compare mouse coordinates over time
    if (state != 1) { timeout = setTimeout( function(){compare(ev, ob);} , cfg.interval );}
  };

  // A private function for handling mouse 'hovering'
  var handleOut = function(e) {
    // copy objects to be passed into t (required for event object to be passed in IE)
    var ev = extend({}, e);
    var ob = this;

    // cancel hoverIntent timer if it exists
    if (timeout) { timeout = clearTimeout(timeout); }

    // unbind expensive mousemove event
    events.unbind(ob, "mousemove", track);
    // if hoverIntent state is true, then call the mouseOut function after the specified delay
    if (state == 1) { timeout = setTimeout( function(){delay(ev, ob);} , cfg.timeout );}
  };

  // listen for mouseenter and mouseout
  if ('mouseenter' in element) {
    events.bind(element, 'mouseenter', handleEnter);
    events.bind(element, 'mouseleave', handleOut);
  } else {
    mouseInOut.bind(element, 'mouseenter', handleEnter);
    mouseInOut.bind(element, 'mouseleave', handleOut);
  }
  return element;
};
