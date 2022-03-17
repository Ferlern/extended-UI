const bars = require("extended-ui/units/health-shield-bar");

const force = false;

Events.run(Trigger.draw, () => {
    if (!Core.settings.getBool("eui-showUnitBar", true)) return;
    Groups.unit.each((unit) => {
        if (bars.drawUnitHealthBar(unit, force)) {
            bars.drawUnitShieldBar(unit, true, force);
        } else {
            bars.drawUnitShieldBar(unit, false, force);
        }
    });
});
