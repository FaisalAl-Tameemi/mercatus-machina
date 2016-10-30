/**
 * Price model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var Price = require('../../sqldb').Price;
var PriceEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PriceEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Price.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {

    PriceEvents.emit(event + ':' + doc.id, doc);
    PriceEvents.emit(event, doc);
    done(null);
  }
}

module.exports = PriceEvents;
