const iterationTools = require("extended-ui/utils/iteration-tools");

const powerBarDefaultWidth = 300;
const powerBarDefaultHeight = 25;

let graphs = [];
let coreItems;
let storedNetPower;
let maxNetPower;
let currentNetPower;


Events.run(Trigger.update, () => {
    graphs = [];
    storedNetPower = 0;
    maxNetPower = 0;
    currentNetPower = 0;

    let getAllPowerGraphs = (tile) => {
        if (tile.build && tile.build.power) {
            let graph = tile.build.power.graph;

            if (!graphs.includes(graph)) {
                graphs.push(graph);

                storedNetPower += graph.getBatteryStored();
                maxNetPower += graph.getTotalBatteryCapacity();
                currentNetPower += graph.getPowerBalance();
            }
        }
    }

    iterationTools.iterateSeq(getAllPowerGraphs, Vars.indexer.getAllied(Vars.player.team(), BlockFlag.generator).iterator());
    
    
});

Events.on(ClientLoadEvent, event => {
    coreItems = Vars.ui.hudGroup.find("coreitems");
    coreItems.row();
    coreItems.getCells().get(0).padBottom(6);

    let powerBar = new Bar(prov(() => powerToString()), prov(() => Pal.accent), floatp(() => currentPowerStatus()));
    coreItems.add(powerBar).width(powerBarDefaultWidth).height(powerBarDefaultHeight).pad(4);
});

function currentPowerStatus() {
    if (!maxNetPower) {
        return 0;
    }
    return storedNetPower / maxNetPower;
}

function powerToString() {
    let num = Math.round(currentNetPower*60); 

    let graphString = graphs.length > 1 ? " (sep " + graphs.length + ')' : '';
    let sign = num > 0 ? '+' : '';
    let color = num >= 0 ? '[stat]' : '[red]';
    let powerString;

    let power = Math.floor(Math.log(Math.abs(num)) / Math.log(1000)) - 1;
    if (power > 0) {
        powerString = num.toString().slice(0, -3*power) + 'k'.repeat(power);
    } else {
        powerString = num.toString();
    }
    return color + sign + powerString + '[white]' + graphString;
}
