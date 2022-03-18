Events.on(EventType.ClientLoadEvent, () => {
    const settings = Vars.ui.settings.graphics;
    settings.row();
    settings.button("Extended UI", Styles.defaultt, () => extendedUIDialogSettings.show()).width(240).height(50);
    
    const extendedUIDialogSettings = new BaseDialog("Extended UI settings");
    extendedUIDialogSettings.addCloseButton();
    extendedUIDialogSettings.buttons.defaults().size(240, 60);

    extendedUIDialogSettings.cont.pane((() => {

        let contentTable;
        if (Version.number < 7) {
            contentTable = new Packages.arc.scene.ui.SettingsDialog.SettingsTable();
        } else {
            contentTable = new SettingsMenuDialog.SettingsTable();
        }

        contentTable.checkPref("eui-showPowerBar", true);
        contentTable.checkPref("eui-showFactoryProgress", true);
        contentTable.checkPref("eui-showUnitBar", true);
        contentTable.checkPref("eui-ShowUnitTable", true);
        contentTable.checkPref("eui-ShowBlockInfo", true);
        contentTable.checkPref("eui-ShowSchematicsTable", true);
        contentTable.sliderPref("eui-SchematicsTableRows", 4, 2, 10, 1, i => i);
        contentTable.sliderPref("eui-SchematicsTableColumns", 5, 4, 8, 1, i => i);
        contentTable.sliderPref("eui-SchematicsTableButtonSize", 30, 20, 80, 5, i => i);
        contentTable.checkPref("eui-ShowEfficiency", false);
        contentTable.sliderPref("eui-EfficiencyTimer", 15, 10, 180, 5, i => i);
        contentTable.checkPref("eui-TrackPlayerCursor", false);
        contentTable.checkPref("eui-TrackLogicControl", false);

        return contentTable;
    })());
});
