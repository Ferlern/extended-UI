exports.addInQueue = function(sender, properties) {
    let size = queue.push(new QueueItem(sender, properties));
    if (size > maxQueueSize) queue.shift();
}

exports.debug = function(text) {
    let properties = {showTime: 10};
    exports.addInQueue(() => (Vars.ui.announce(text, 10)), properties);
}

Events.run(Trigger.update, () => {
    let item = QueuePop();
    if (item) {
        item.sender();
    }
})

const maxQueueSize = 50;
let nextTime = Date.now() + 10000;
let id = 0;
let queue = [];
let repeats = {};

function QueueItem(sender, properties) {
    this.id = ++id;
    this.sender = sender;
    if (!properties) properties = {};
    
    this.delayer = properties.delayer || (() => false);
    this.name = properties.name || null;
    this.repetitions = properties.properties || 0;
    this.showTime = properties.showTime || 0;
}

function QueuePop() {
    if (nextTime > Date.now() || queue.length == 0) return;
    
    let item = queue.shift();

    if (item.delayer()) {
        queue.push(item);
        nextTime = Date.now() + 1000;
        return;
    }

    let repetitions = item.repetitions;
    if (repetitions) {
        let itemRepeats = repeats[item.name]; 

        if (!itemRepeats) {
            repeats[item.name] = 1;
        } else if (itemRepeats >= repetitions) {
            return;
        }
    }

    nextTime = Date.now() + item.showTime*1000;
    return item;
}
