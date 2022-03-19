const output = require("extended-ui/utils/output-wrapper");

const modules = [
    "utils/polyfill",
    "ui/settings-ui",
    "ui/schematics-table-ui",
    "ui/units-table-ui",
    "ui/block-info-ui",
    "ui/power-ui",
    "blocks/progress-bar",
    "blocks/efficiency",
    "units/draw-cycle",
    "other/extend-zoom",
]

for (let module of modules) {
    try {
        require("extended-ui/" + module);
    } catch(e) {
        log("Extended UI: can't load " + module + "\nIn " + e.fileName + "#" + e.lineNumber + " " + e.name + ': ' + e.message);
        output.debug(Core.bundle.format("eui.load-error", module));
    }
}
