global.eui = {} // global mod object for fast access to important mod functions from console
global.eui.relativeValue = require("extended-ui/utils/relative-value");
global.eui.drawTasks = require("extended-ui/utils/draw-tasks");

const output = require("extended-ui/utils/output-wrapper");

const modules = [
    "utils/polyfill",
    "interact/auto-fill",
    "ui/settings-ui",
    "ui/schematics-table-ui",
    "ui/power-ui",
    "ui/blocks/block-info-ui",
    "ui/blocks/progress-bar",
    "ui/blocks/efficiency",
    "ui/units/units-table-ui",
    "ui/units/draw-cycle",
    "ui/alerts/losing-support",
    "ui/alerts/under-attack",
    "other/extend-zoom",
    "other/mine",
]

for (let module of modules) {
    try {
        require("extended-ui/" + module);
    } catch(e) {
        log("Extended UI: can't load " + module + "\nIn " + e.fileName + "#" + e.lineNumber + " " + e.name + ': ' + e.message);
        output.debug(Core.bundle.format("eui.load-error", module));
    }
}
