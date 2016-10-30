/**
 * Vendor model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var Vendor = require('../../sqldb').Vendor;
var VendorEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
VendorEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Vendor.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {

    VendorEvents.emit(event + ':' + doc.id, doc);
    VendorEvents.emit(event, doc);
    done(null);
  }
}

module.exports = VendorEvents;
