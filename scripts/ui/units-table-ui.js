const unitsCounter = require("extended-ui/units/units-counter");

const granulatiry = 6;
const amountToDisplay = 8;
let labels = [];
let newLabelText = '';
let updateTimer = Date.now();
let prevUnitsUiVisible = true;
let unitsUiVisible = true;
let hideCoreUnits = false;
let hideSupportUnits = false;
let isBuilded = false;

let overlayMarker;
let contentTable;

const unitUnicodes = {
    'dagger': '\uF800',
    'mace': '\uF7FF',
    'fortress': '\uF7FE',
    'scepter': '\uF7DB',
    'reign': '\uF7DA',
    'nova': '\uF7FD',
    'pulsar': '\uF7FC',
    'quasar': '\uF7FB',
    'vela': '\uF7C1',
    'corvus': '\uF7C0',
    'crawler': '\uF7FA',
    'atrax': '\uF7F9',
    'spiroct': '\uF7F8',
    'arkyid': '\uF7F7',
    'toxopid': '\uF7DE',
    'flare': '\uF7F6',
    'horizon': '\uF7F5',
    'zenith': '\uF7F4',
    'antumbra': '\uF7F3',
    'eclipse': '\uF7F2',
    'mono': '\uF7F1',
    'poly': '\uF7F0',
    'mega': '\uF7EF',
    'quad': '\uF7C3',
    'oct': '\uF7C2',
    'risso': '\uF7E7',
    'minke': '\uF7ED',
    'bryde': '\uF7EC',
    'sei': '\uF7C4',
    'omura': '\uF7C6',
    'alpha': '\uF7EB',
    'beta': '\uF7EA',
    'gamma': '\uF7E9',
    'retusa': '\uF788',
    'oxynoe': '\uF784',
    'cyerce': '\uF783',
    'aegires': '\uF782',
    'navanax': '\uF780',
}

Events.run(Trigger.update, () => {
    if (!Core.settings.getBool("eui-ShowUnitTable", true)) {
        if (isBuilded) {
            clearTable();
        }
        return;
    }

    if (!overlayMarker) {
        setMarker();
    }

    if (isRebuildNeeded()) {
        rebuildTable();
    }

    const timer = Date.now();
    if (timer - 100 < updateTimer) return;
    updateTimer = timer;

    const unitsValueTop = unitsCounter.getUnitsValueTop(amountToDisplay, granulatiry, hideCoreUnits, hideSupportUnits);
    
    newLabelText = '';
    for (let i = 0; i < amountToDisplay; i++) {
        let teamInfo = unitsValueTop[i];

        if (!teamInfo) {
            newLabelText = '';
        } else {
            let team = teamInfo[1].team;
            let teamUnits = teamInfo[1].units;
            newLabelText = '';
            // newLabelText = getTeamColor(team) + team.name + ': ';

            for (let unit of Object.entries(teamUnits)) {
                newLabelText += getTeamColor(team) + unit[1].amount + '[white]';
                newLabelText += unitUnicodes[unit[0]] || '[?]';
                newLabelText += ' ';
            }
        };
        let currentLabel = labels[i];
        if (currentLabel) currentLabel.setText(newLabelText);
    }
});

function rebuildTable() {
    clearTable();
    buildTable();
}

function clearTable() {
    if (!isBuilded) return;

    labels = [];
    contentTable.clearChildren();
    isBuilded = false;
}

function buildTable() {
    const buttonSize = 40;

    let unitTableButtons = contentTable.table().width(buttonSize*3).margin(3).get();

    unitTableButtons.button(Icon.play, Styles.defaulti, run( () => {
        unitsUiVisible = !unitsUiVisible;
    })).width(buttonSize).height(buttonSize).pad(1).name("show").tooltip("Show or hide units table");

    let imageButton = unitTableButtons.button(new TextureRegionDrawable(Icon.players), Styles.defaulti, run( () => {
        hideCoreUnits = !hideCoreUnits;
    })).update(b => b.setChecked(hideCoreUnits)).width(buttonSize).height(buttonSize).pad(1).name("core-units").tooltip("Hide core defender").get();
    imageButton.visibility = () => unitsUiVisible;
    imageButton.resizeImage(buttonSize*0.6);

    imageButton = unitTableButtons.button(new TextureRegionDrawable(Icon.github), Styles.defaulti, run( () => {
        hideSupportUnits = !hideSupportUnits;
    })).update(b => b.setChecked(hideSupportUnits)).width(buttonSize).height(buttonSize).pad(1).name("support-units").tooltip("Hide support units").get();
    imageButton.visibility = () => unitsUiVisible;
    imageButton.resizeImage(buttonSize*0.6);


    //TODO remove this stupid way for align buttons
    unitTableButtons.labelWrap("").width(300 - (buttonSize + 2) * 3);

    contentTable.row();

    let unitTable = contentTable.table().margin(3).get();


    unitTable.visibility = () => {
        return unitsUiVisible;
    };

    for (let i = 0; i < amountToDisplay; i++) {
        labels.push(unitTable.labelWrap("").width(300).pad(1).get());
        unitTable.row();
    }

    isBuilded = true;
}

function isRebuildNeeded() {
    if (!isBuilded) return true;
    return false;
}

function setMarker() {
    const contentTableStyle = Version.number > 6 ? Tex.buttonEdge4 : Styles.black3

    overlayMarker = Vars.ui.hudGroup.find("waves");
    overlayMarker.row();
    contentTable = overlayMarker.table(contentTableStyle).update((t) => {
        if (prevUnitsUiVisible != unitsUiVisible) {
            t.setBackground(unitsUiVisible ? contentTableStyle : Styles.none);
            prevUnitsUiVisible = unitsUiVisible;
        }
    }).name("unit-table").top().left().marginLeft(0).marginBottom(0).marginTop(0).get();
    contentTable.visibility = () => isBuilded;
}

function getTeamColor(team) {
    return "[#"+team.color.toString()+"]";
}
function toBlockEmoji(block) {
    return String.fromCharCode(Fonts.getUnicode(block.name));
}
