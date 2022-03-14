exports.getAll = function() {
    return Object.assign({}, allIcons, allSprites);
}

exports.getByName = function(name) {
    return allIcons[name] || allSprites[name] || new TextureRegionDrawable(Icon.pencil);
}

exports.getIcons = function() {
    // Sometimes icons don't load, so reload them if that happens
    if (Object.keys(allIcons).length == 0) {
        Icon.icons.each((name, icon) => {
            allIcons[name] = new TextureRegionDrawable(icon);
        });
    }
    return allIcons;
}

exports.getSprites = function() {
    return allSprites
}

const spriteClasses = [Items, Liquids, UnitTypes, Blocks]
let allIcons = {};
let allSprites = {};

for (let spriteClass of spriteClasses) {
	for (let key in spriteClass) {
		let item = spriteClass[key];
		if (!(typeof item.icon === 'function')) continue;
		try {
			allSprites[item.name] = new TextureRegionDrawable(item.icon(Cicon.medium));
		} catch (e) {}
	}
}
