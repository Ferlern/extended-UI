const unitsCounter = require("extended-ui/units/units-counter");
const teamsUtil = require("extended-ui/utils/teams");

const granulatiry = 6;
const amountToDisplay = 8;
let labels = [];
let newLabelText = '';
let updateTimer = Date.now();
let unitsUiVisible = true;
let hideCoreUnits = false;
let hideSupportUnits = false;

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
}

Events.on(ClientLoadEvent, event => {
    Vars.ui.hudGroup.fill(cons(t => {
        let nestedTable = t.table(Styles.black3).margin(3).get();

        t.visibility = () => {
            return unitsUiVisible;
        };

        for (let i = 0; i < amountToDisplay + 1; i++) {
            labels.push(nestedTable.labelWrap("").width(300).pad(1).get());
            nestedTable.row();
        }

        nestedTable.pack();

        t.top().left().marginTop(125);
        t.pack();
    }));    
})

Events.on(ClientLoadEvent, event => {
    Vars.ui.hudGroup.fill(cons(t => {
        const buttonSize = 40;

        t.button(Icon.play, Styles.clearTransi, run( () => {
			unitsUiVisible = !unitsUiVisible;
		})).width(buttonSize).height(buttonSize).name("show").tooltip("Show or hide units table");

        let imageButton = t.button(Icon.refresh, Styles.clearTransi, run( () => {
			teamsUtil.getAllTeams(true);
		})).width(buttonSize).height(buttonSize).name("refresh").tooltip("Refresh teams").get();
        imageButton.visibility = () => unitsUiVisible;

        imageButton = t.button(Icon.players, Styles.clearToggleTransi, run( () => {
			hideCoreUnits = !hideCoreUnits;
		})).update(b => b.setChecked(hideCoreUnits)).width(buttonSize).height(buttonSize).name("core-units").tooltip("Hide core defender").get();
        imageButton.visibility = () => unitsUiVisible;

        imageButton = t.button(Icon.github, Styles.clearToggleTransi, run( () => {
			hideSupportUnits = !hideSupportUnits;
		})).update(b => b.setChecked(hideSupportUnits)).width(buttonSize).height(buttonSize).name("support-units").tooltip("Hide support units").get();
        imageButton.visibility = () => unitsUiVisible;

        t.top().left().marginTop(85);
        t.pack();
    }));    
})

Events.run(Trigger.update, () => {
    const timer = Date.now();
    if (timer - 2000 < updateTimer) return;
    updateTimer = timer;

    const unitsValueTop = unitsCounter.getUnitsValueTop(amountToDisplay, granulatiry, hideCoreUnits, hideSupportUnits);
    
    newLabelText = '';
    for (let i = 0; i < amountToDisplay; i++) {
        let teamInfo = unitsValueTop[i];
        if (!teamInfo) {
            newLabelText = '';
        } else {
            let team = teamInfo.team;
            let teamUnits = teamInfo.units;
            newLabelText = '';
            // newLabelText = getTeamColor(team) + team.name + ': ';

            for (let unit of Object.entries(teamUnits)) {
                newLabelText += getTeamColor(team) + unit[1].amount + '[white]' + unitUnicodes[unit[0]] + ' ';
            }
        };
        labels[i].setText(newLabelText);
    }
});

function getTeamColor(team){
	return "[#"+team.color.toString()+"]";
}
function toBlockEmoji(block){
	return String.fromCharCode(Fonts.getUnicode(block.name));
}
