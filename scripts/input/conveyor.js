const euiEvents = require("extended-ui/utils/event/events");
const drawPlans = require("extended-ui/utils/draw/build-plan");
const adjacentPosition = require("extended-ui/utils/ai/adjacent-position");
const pathfind = require("extended-ui/utils/ai/pathfind");

const pathfindSelector = (block) => {
    if (block == Blocks.conveyor ||
        block == Blocks.titaniumConveyor) return pathfind.conveyorPathfind;
    if (block == Blocks.junction) return pathfind.junctionPathfind;
    if (block == Blocks.underflowGate) return pathfind.gatePathfind;
}

let isListen = false;
let buildPlans = [];
let lastStartTile = null;
let lastMouseTile = null;

Events.run(Trigger.draw, () => {
    if (buildPlans) {
        drawPlans.draw(buildPlans);
    }
});

const listener = (startPos, startTile, pos, mouseTile) => {
    if (startTile == lastStartTile && mouseTile == lastMouseTile ||
        startTile == mouseTile ||
        Vars.control.input.isUsingSchematic() ||
        Vars.control.input.selectedBlock()) return;

    lastStartTile = startTile;
    lastMouseTile = mouseTile;
    const destination = adjacentPosition.find(mouseTile, startTile, Blocks.copperWall);
    if (!destination) return;

    const startBlock = startTile.block();
    buildPlans = pathfindSelector(startBlock)(startTile, destination, mouseTile, startBlock);
}

euiEvents.on(euiEvents.eventType.dragStarted, (startPos, startTile) => {
    if (startTile && pathfindSelector(startTile.block()) && (!isListen)) {
        isListen = true;
        euiEvents.on(euiEvents.eventType.dragged, listener);
    }
});

euiEvents.on(euiEvents.eventType.dragEnded, () => {
    if (isListen) {
        if (buildPlans) {
            buildPlans.forEach(plan => Vars.player.unit().addBuild(plan));
            buildPlans = [];
        }
        isListen = false;
        euiEvents.removeListener(euiEvents.eventType.dragged, listener);
    }
});
