const euiEvents = require("extended-ui/utils/event/events");

let startPos;
let startTile;
let dragging = false;

euiEvents.eventType.dragStarted = "dragStarted";
euiEvents.eventType.dragged = "dragged";
euiEvents.eventType.dragEnded = "dragEnded";

const listener = event => {
    if (event instanceof InputEvent) {
        if (event.keyCode == "Mouse Left") {
            let pos = Core.input.mouseWorld(Core.input.mouseX(), Core.input.mouseY());
            let mouseTile = Vars.world.tileWorld(pos.x, pos.y);

            if (event.type == "keyDown") {
                startPos = { x: pos.x, y: pos.y };
                startTile = mouseTile;
                dragging = true;
                euiEvents.emit(euiEvents.eventType.dragStarted, startPos, startTile);

            } else if (event.type == "keyUp") {
                if (dragging) {
                    dragging = false;
                    euiEvents.emit(euiEvents.eventType.dragEnded, startPos, startTile, pos, mouseTile);
                }
            }
        }
    }
    return false;
}

Events.run(Trigger.update, () => {
    if (dragging) {
        let pos = Core.input.mouseWorld(Core.input.mouseX(), Core.input.mouseY());
        let mouseTile = Vars.world.tileWorld(pos.x, pos.y);

        if (!mouseTile) return;

        euiEvents.emit(euiEvents.eventType.dragged, startPos, startTile, pos, mouseTile);
    }
});

Events.on(ClientLoadEvent, () => {
    Core.scene.addListener(listener);
});

