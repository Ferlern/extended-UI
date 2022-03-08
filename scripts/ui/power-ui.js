const iterationTools = require("extended-ui/utils/iteration-tools");

const powerBarDefaultWidth = 300;
const powerBarDefaultHeight = 25;

let graphs = [];
let coreItems;
let storedNetPower;
let maxNetPower;
let currentNetPower;

let debugTimer;


Events.run(Trigger.update, () => {
    let newStoredNetPower = 0;
    let newMaxNetPower = 0;
    let newCurrentNetPower = 0;
    let newGraphs = [];

    let getAllPowerGraphs = (tile) => {
        if (tile.build && tile.build.power) {
            let graph = tile.build.power.graph;

            if (!newGraphs.includes(graph)) {

                // storing more than 100 graphs can provide some lags
                if (newGraphs.length < 100) newGraphs.push(graph);

                newStoredNetPower += graph.getBatteryStored();
                newMaxNetPower += graph.getTotalBatteryCapacity();
                newCurrentNetPower += graph.getPowerBalance();
            }
        }
    }

    iterationTools.iterateSeq(getAllPowerGraphs, Vars.indexer.getAllied(Vars.player.team(), BlockFlag.generator).iterator());
    iterationTools.iterateSeq(getAllPowerGraphs, Vars.indexer.getAllied(Vars.player.team(), BlockFlag.reactor).iterator());
    
    // when player remove power node, power go to 0 for ~half of a second somehow.
    if (currentNetPower && !newCurrentNetPower) {
        if (!debugTimer) {
            debugTimer = Date.now();
            return;
        } else if (Date.now() < debugTimer + 500) {
            return;
        }
    }

    debugTimer = 0;

    storedNetPower = newStoredNetPower;
    maxNetPower = newMaxNetPower;
    currentNetPower = newCurrentNetPower;
    graphs = newGraphs;
});

Events.on(ClientLoadEvent, event => {
    coreItems = Vars.ui.hudGroup.find("coreitems");
    coreItems.row();
    coreItems.getCells().get(0).padBottom(6);

    let powerBar = new Bar(prov(() => powerToString()), prov(() => Pal.accent), floatp(() => currentPowerStatus()));
    coreItems.add(powerBar).visible(() => Boolean(storedNetPower) || Boolean(currentNetPower)).width(powerBarDefaultWidth).height(powerBarDefaultHeight).pad(4);
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
