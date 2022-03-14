exports.getAll = function() {
    return Object.assign({}, allIcons, allSprites);
}

exports.getIcons = function() {
    if (Object.keys(allIcons).length == 0) {
        Icon.icons.each((name, icon) => {
            allIcons[name] = new TextureRegionDrawable(icon);
        });
    }
    return allIcons;
}

exports.getSprites = function() {
    if (Object.keys(allSprites).length == 0) {
        setupSprites();
    }
    return allSprites;
}

exports.getByName = function(name) {
    return exports.getIcons()[name] || exports.getSprites()[name] || new TextureRegionDrawable(Icon.pencil);
}

const spriteClasses = [Items, Liquids, UnitTypes, Blocks]
let allIcons = {};
let allSprites = {};

function setupSprites() {
    for (let spriteClass of spriteClasses) {
        for (let key in spriteClass) {
            let item = spriteClass[key];
            if (!(typeof item.icon === 'function')) continue;
            try {
                allSprites[item.name] = new TextureRegionDrawable(item.icon(Cicon.medium));
            } catch (e) {}
        }
    }
}
