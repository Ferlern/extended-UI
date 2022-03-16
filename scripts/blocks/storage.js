exports.updateStatus = function(build, status) {
    const currentStatus = storage.get(build.id);

    if (!currentStatus) {
        storage.set(build.id, status);
    } else {
        for (let pair in Object.entries(status)) {
            currentStatus[pair[0]] = pair[1];
        }
    }
}

exports.getStatus = function(build, field) {
    const currentStatus = storage.get(build.id);

    if (currentStatus) return currentStatus[field];
}

let storage = new Map();

Events.on(EventType.WorldLoadEvent, () => {
    storage = new Map();
});
