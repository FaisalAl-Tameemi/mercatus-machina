/**
 * Symbol model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var Symbol = require('../../sqldb').Symbol;
var SymbolEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
SymbolEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Symbol.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {

    SymbolEvents.emit(event + ':' + doc.id, doc);
    SymbolEvents.emit(event, doc);
    done(null);
  }
}

module.exports = SymbolEvents;
