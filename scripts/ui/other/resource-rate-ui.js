const Difference = require("extended-ui/utils/difference");
const formattingUtil = require("extended-ui/utils/formatting");

const diffs = {};

let contentTable;
let coreItemsCell; // for v6
let coreItemsCollapser; // for v7
let oldCoreItemsTable;

let isReplaced = false;

Events.on(ClientLoadEvent, () => {
    contentTable = new Table(Styles.black6);
    contentTable.pack();

    if (Version.number < 7) {
        const coreInfoTable = Vars.ui.hudGroup.find("coreitems");
        coreItemsCell = coreInfoTable.getCell(oldCoreItemsTable);
        oldCoreItemsTable = coreInfoTable.getChildren().get(0);
    } else {
        coreItemsCollapser = Vars.ui.hudGroup.find('coreinfo').getChildren().get(1).getChildren().get(0);
        oldCoreItemsTable = coreItemsCollapser.getChildren().get(0);
    }
    Timer.schedule(update, 0, 3);
});

Events.run(Trigger.update, () => {
    if (!isReplaced) return;
    rebuildTable();
});

function update() {
    if (Core.settings.getBool("eui-ShowResourceRate", false)) {
        if (!isReplaced) {
            isReplaced = true;
            if (Version.number < 7) {
                coreItemsCell.setElement(contentTable);
            } else {
                coreItemsCollapser.setTable(contentTable);
            }
        }
    } else {
        if (isReplaced) {
            isReplaced = false;
            if (Version.number < 7) {
                coreItemsCell.setElement(oldCoreItemsTable);
            } else {
                coreItemsCollapser.setTable(oldCoreItemsTable);
            }
        }
    }
}

function rebuildTable() {
    clearTable();
    buildTable();
}

function buildTable() {
    const resourcesTable = contentTable.table().get();
    const currentItems = Vars.player.team().items();
    let i = 0;
    currentItems.each((item,amount) => {
        let diff = diffs[item]
        if (!diff) {
            diff = new Difference(1000, amount);
            diffs[item] = diff;
        }
        const difference = diff.difference(amount);
        const color = difference >= 0 ? '[green]' : '[red]';
        const sign = difference >= 0 ? '+' : '';

        resourcesTable.image(item.icon(Cicon.small)).left();
        resourcesTable.label(() => {
            return formattingUtil.numberToString(amount);
        }).padLeft(2).left().padRight(1);
        resourcesTable.label(() => {
            return "(" + color + sign + formattingUtil.numberToString(Math.round(difference)) + "[white])";
        }).left().padRight(2);

        if(++i % 4 == 0) {
            resourcesTable.row();
        }
    });
    contentTable.row();
}

function clearTable() {
    contentTable.clearChildren();
}
