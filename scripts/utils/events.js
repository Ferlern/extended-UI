exports.eventType = {
    schemSelectionButtonPresed: 'schemSelectionButtonPresed',
    schemSelectionEnd: 'schemSelectionEnd',
}

exports.on = function (event, listener) {
    if (typeof events[event] !== 'object') {
        events[event] = [];
    }

    events[event].push(listener);
};

exports.removeListener = function (event, listener) {
    let idx;

    if (typeof events[event] === 'object') {
        idx = indexOf(events[event], listener);

        if (idx > -1) {
            events[event].splice(idx, 1);
        }
    }
};

exports.emit = function (event) {
    let i, listeners, length, args = [].slice.call(arguments, 1);

    if (typeof events[event] == 'object') {
        listeners = events[event].slice();
        length = listeners.length;

        for (i = 0; i < length; i++) {
            listeners[i].apply(this, args);
        }
    }
};

exports.once = function (event, listener) {
    exports.on(event, function g () {
        exports.removeListener(event, g);
        listener.apply(this, arguments);
    });
};

const events = {}
