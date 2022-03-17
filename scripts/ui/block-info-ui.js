const visibleUtil = require("extended-ui/utils/visible");
const formattingUtil = require("extended-ui/utils/formatting");
let contentTable;

let isBuilded = false;

Events.on(ClientLoadEvent, () => {
    Vars.ui.hudGroup.fill(cons(t => {
        contentTable = t.table(Styles.black3).margin(4).get();
        contentTable.visibility = () => infoTableVisibility();
        t.bottom().left();
        t.pack();
    }));
})

Events.run(Trigger.update, () => {
    if (!Core.settings.getBool("eui-ShowBlockInfo", true)) {
        if (isBuilded) {
            clearTable();
        }
        return;
    }

    if (!contentTable) return;

    let x = Core.input.mouseX();
    let y = Core.input.mouseY();

    let pos = Core.input.mouseWorld(x, y);
    let mouseTile = Vars.world.tileWorld(pos.x, pos.y);

    if (!mouseTile) return;

    let build = mouseTile.build;

    if (!build) {
        if (isBuilded) {
            clearTable();
        }
        return;
    }

    if (isRebuildNeeded(build)) {
        rebuildTable(build);
    }
});

function isRebuildNeeded(build) {
    //Useless? Should be rebuilded every frame to get last info about hovered block
    return true;
}

function rebuildTable(build) {
    clearTable();
    buildTable(build);
}

function clearTable() {
    if (!isBuilded) return;

    contentTable.clearChildren();
    isBuilded = false;
}

function buildTable(build) {
    let isPlayerTeam = build.team == Vars.player.team();

    if (build.power && !isPlayerTeam) {
        const powerTable = contentTable.table().get();
        const graph = build.power.graph;

        const storedNetPower = graph.getBatteryStored();
        const maxNetPower = graph.getTotalBatteryCapacity();
        const currentNetPower = graph.getPowerBalance();

        powerTable.label(() => {
            return "Power: " + formattingUtil.powerToString(currentNetPower, []);
        })
        powerTable.row();
        if (maxNetPower) {
            powerTable.label(() => "Stored: " + Math.round(storedNetPower/maxNetPower*100) + "%");
        }
    } else if (build.items && !isPlayerTeam || build.items && build.items.total() <= 20) {
        const resourcesTable = contentTable.table().get();
        let i = 0;
        build.items.each((item,amount) => {
            resourcesTable.image(item.icon(Cicon.small)).left();
            resourcesTable.label(() => {
                return amount.toString();
            }).padLeft(2).left().padRight(4);

            if(++i % 4 == 0) {
                resourcesTable.row();
            }
        });
    }
    isBuilded = true;
}

function infoTableVisibility() {
    return visibleUtil.isHudVisible() && isBuilded;
}
