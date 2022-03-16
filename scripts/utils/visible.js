exports.isHudVisible = function() {
    if (!marker) return false;
    //TODO find another way to do it
    return marker.visible;
}

Events.on(ClientLoadEvent, () => {
    marker = Vars.ui.hudGroup.find("waves");
})

let marker;
