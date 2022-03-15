const output = require("extended-ui/utils/output-wrapper");

const modules = [
    "utils/polyfill",
    "ui/settings-ui",
    "ui/schematics-table-ui",
    "ui/units-table-ui",
    "ui/power-ui",
    "ui/progress-bar",
    "ui/health-shield-bar",
    "other/extend-zoom",
]

for (let module of modules) {
    try {
        require("extended-ui/" + module);
    } catch(e) {
        log("Extended UI: can't load " + module + "\nIn " + e.fileName + "#" + e.lineNumber + " " + e.name + ': ' + e.message);
        output.debug("Extended UI: can't load " + module + "\nPlease report this bug on GitHub");
    }
}
