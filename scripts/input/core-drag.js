const euiEvents = require("extended-ui/utils/event/events");
const drawPlans = require("extended-ui/utils/draw/build-plan");

const targetBlock = Blocks.vault;
const targetBlockSize = Blocks.vault.size;
let isListen = false;
let buildPlan = null;

Events.run(Trigger.draw, () => {
    if (buildPlan) {
        drawPlans.drawOne(buildPlan);
    }
});

const listener = (startPos, startTile, pos, mouseTile) => {
    const vectorX = mouseTile.x - startTile.centerX();
    const vectorY = mouseTile.y - startTile.centerY();
    const distance = Mathf.dst(vectorX, vectorY);
    const draggedBlockSize = startTile.block().size;

    if (distance < draggedBlockSize) {
        buildPlan = null;
        return;
    }

    const adjacentPosition = findAdjacentPosition(startTile, pos);
    buildPlan = new BuildPlan(adjacentPosition.x, adjacentPosition.y, 0, targetBlock);
}

euiEvents.on(euiEvents.eventType.dragStarted, (startPos, startTile) => {
    if (startTile && startTile.block() instanceof CoreBlock && (!isListen)) {
        isListen = true;
        euiEvents.on(euiEvents.eventType.dragged, listener);
    }
});

euiEvents.on(euiEvents.eventType.dragEnded, () => {
    if (isListen) {
        if (buildPlan) {
            Vars.player.unit().addBuild(buildPlan);
            buildPlan = null;
        }
        isListen = false;
        euiEvents.removeListener(euiEvents.eventType.dragged, listener);
    }
});

// TODO: there's should be a better way to do this
function findAdjacentPosition(startTile, pos) {
    const stepAmount = targetBlockSize/2 + startTile.block().size/2;
    let diagStep = 0;
    let currentX = startTile.centerX();
    let currentY = startTile.centerY();

    if (startTile.block().size % 2 == 0) {
        currentX += 0.5;
        currentY += 0.5;
    }

    if (!Number.isInteger(stepAmount)) {
        const angle = Mathf.angle(pos.x - currentX*8, pos.y - currentY*8);
        let stepDirection = Math.round(angle / 45) % 8;
        if (stepDirection % 2 != 0) diagStep++;

        let {x: x, y: y} = step(currentX, currentY, stepDirection, 0.5);
        currentX = x;
        currentY = y;
    }

    for (let i = 0; i < Math.floor(stepAmount); i++) {
        let angle = Mathf.angle(pos.x - currentX*8, pos.y - currentY*8);
        let stepDirection;

        if (diagStep < stepAmount - 1) {
            stepDirection = Math.round(angle / 45) % 8;
        } else {
            stepDirection = (Math.round(angle / 90) % 4) * 2;
        }
        if (stepDirection % 2 != 0) diagStep++;

        let {x: x, y: y} = step(currentX, currentY, stepDirection, 1);
        currentX = x;
        currentY = y;
    }

    return {x: Math.floor(currentX), y: Math.floor(currentY)};
}

function step(x, y, direction, lenght) {
    if ([7,0,1].includes(direction)) {
        x += lenght;
    } else if ([3,4,5].includes(direction)) {
        x -= lenght;
    }
    if ([1,2,3].includes(direction)) {
        y += lenght;
    } else if ([5,6,7].includes(direction)) {
        y -= lenght;
    }
    return {x: x, y: y};
}
