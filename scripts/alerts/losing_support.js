const Alerts = require("extended-ui/alerts/alert");
const output = require("extended-ui/utils/output-wrapper");

let sended = false;

Events.on(EventType.WorldLoadEvent, () => {
    sended = false;
});

let event = (unit) => {
    if (sended) return;
    // ?
}

new Alerts.BaseAlert(
    () => {
        Events.on(UnitDestroyEvent, event);
    },
    () => {
        Events.remove(UnitDestroyEvent, event);
    }
)
