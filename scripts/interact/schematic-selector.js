const euiEvents = require("extended-ui/utils/events");
const schematicsCreate = require("extended-ui/utils/schematics");

let x1 = 0;
let y1 = 0;
let x2 = 0;
let y2 = 0;

let startDrawX = 0;
let startDrawY = 0;

Events.run(Trigger.draw, () => {
    if (x1 || y1) {
        let pos = Core.input.mouseWorld(Core.input.mouseX(), Core.input.mouseY());
        Draw.draw(Layer.overlayUI+0.01, () => {
            Draw.z(Layer.darkness + 1);

            Lines.stroke(1, Pal.accent);
            Lines.rect(startDrawX, startDrawY, pos.x - startDrawX, pos.y - startDrawY);
            Draw.reset();
        });
    }
});

const creator = event => {
    if (event instanceof InputEvent && event.keyCode == "Mouse Left") {
        let pos = Core.input.mouseWorld(Core.input.mouseX(), Core.input.mouseY());
        let mouseTile = Vars.world.tileWorld(pos.x, pos.y);

        if (event.type == "keyDown") {
            x1 = mouseTile.centerX();
            y1 = mouseTile.centerY();
            startDrawX = pos.x;
            startDrawY = pos.y;

        } else if (event.type == "keyUp") {
            x2 = mouseTile.centerX();
            y2 = mouseTile.centerY();
            schematicsCreate.create(x1, y1, x2, y2);
            Vars.control.input.lastSchematic = schematicsCreate.create(Math.min(x1,x2), Math.min(y1,y2),
                                                                       Math.max(x1,x2), Math.max(y1,y2));

            if (Vars.control.input.lastSchematic != null) {
                Vars.control.input.useSchematic(Vars.control.input.lastSchematic);
                euiEvents.emit(euiEvents.eventType.schemSelectionEnd);
                Core.scene.removeListener(creator);
            };

            x1 = 0;
            y1 = 0;
            x2 = 0;
            y2 = 0;
        }
    }
    return false;
}

euiEvents.on(euiEvents.eventType.schemSelectionButtonPresed, (active) => {
    if (active) {
        Core.scene.addListener(creator);
    } else {
        Core.scene.removeListener(creator);
    }
});
