exports.getAllTeams = function (force) {
	const timer = Date.now();
    if (!force && allTeams.length) return allTeams;
    updateTimer = timer;

	Vars.world.tiles.each((x,y) => {
		const tile = Vars.world.tile(x,y);
		if (tile.team() !== Team.derelict) {
			if ( !allTeams.includes(tile.team()) ) {
				allTeams.push(tile.team());
			}
		}
	});

	return allTeams;
	
}

let allTeams = [];
let prevMap;
let updateTimer = Date.now();

Events.on(EventType.WorldLoadEvent, e => {
	if (Vars.state.map.name() != prevMap) {
		prevMap = Vars.state.map.name();
		allTeams = [];
	}
});
