importPackage(Packages.arc.util.pooling);

const settings = require("extended-ui/settings");
const barBuilder = require("extended-ui/utils/bar-builder");
const renderUtils = require("extended-ui/utils/render");

const healthBarSize = settings.healthBarSize;
const unitShieldHealthBarSize = settings.unitShieldHealthBarSize;
const projectorShieldHealthBarSize = settings.projectorShieldHealthBarSize;

const damaged = new Map()

Events.on(WorldLoadEvent, (event) => {
    damaged.clear();
})

function drawHealthBar(unit) {
    if (!settings.showUnitHealth) return;

    let value = unit.health / unit.maxHealth;

    if (value == 1 || value < 0 || !renderUtils.inCamera(Core.camera, unit.x, unit.y)) return;

    let prevStatus = damaged.get(unit.id); 
    if (!prevStatus || prevStatus.value != value) {
        damaged.set(unit.id, {value: value, time: Date.now()});
    } else if (Date.now() - prevStatus.time < 10000 ) {
        // Draw.alpha(1 - (Date.now() - prevStatus.time - 5000)/5000); don't work for some reason
    } else {
        return;
    }

    // let text = barBuilder.buildPercentLabel(value); not sure about it.
    Draw.draw(Layer.overlayUI+0.01, run(()=>{
        barBuilder.draw(
            unit.x, unit.y+2, value, unit.hitSize/6, healthBarSize, "", Pal.redDust
        )
    }));
}

Events.run(Trigger.draw, () => {
    Groups.unit.each((unit) => {
        drawHealthBar(unit);
    });
});
