/**
 * Exchange model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var Exchange = require('../../sqldb').Exchange;
var ExchangeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ExchangeEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Exchange.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {

    ExchangeEvents.emit(event + ':' + doc.id, doc);
    ExchangeEvents.emit(event, doc);
    done(null);
  }
}

module.exports = ExchangeEvents;
