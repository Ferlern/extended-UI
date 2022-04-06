const timer = require("extended-ui/interact/interact-timer");

Events.run(Trigger.update, () => {
    if (!Core.settings.getBool("eui-auto-fill", false) || !timer.canInteract()) return;
    const isCoreAvailible = Core.settings.getBool("eui-interact-core", false);
    const player = Vars.player;
    const stack = player.unit().stack;
    const team = player.team();
    const core = player.closestCore();
    let tranfered = false;
    let request = null;

    Vars.indexer.eachBlock(team, player.x, player.y, Vars.buildingRange, () => true, b => {
        if (!timer.canInteract()) return;

        const block = b.tile.block();
        if (!block.consumes.has(ConsumeType.item)) return;

        if (b.acceptStack(stack.item, stack.amount, player.unit()) >= 5) {
            Call.transferInventory(player, b);
            timer.increase();
            tranfered = true;
        }

        if (!isCoreAvailible || request) return;
        if (block instanceof ItemTurret) {
            if (!b.ammo.isEmpty()) return;
            request = getBestAmmo(block, core);
        } else if (block instanceof UnitFactory) {
            request = getUnitFactoryRequest(b, block, core);
        } else if (b.items) {
            request = getItemRequest(b, block, core);
        }
    });
    if (!isCoreAvailible || tranfered || !request || !player.within(core, Vars.buildingRange)) return;

    if (stack.amount) {
        Call.transferInventory(player, core);
    } else {
        Call.requestItem(player, core, request, 999);
    }
    timer.increase();
});

function getBestAmmo(turret, core) {
    let best = null;
    let bestDamage = 0;
    turret.ammoTypes.each((item, ammo) => {
        let totalDamage = ammo.damage + ammo.splashDamage;
        if (totalDamage > bestDamage && core.items.get(item) >= 20) {
            best = item;
            bestDamage = totalDamage;
        }
    });
    return best;
}

function getUnitFactoryRequest(build, block, core) {
    if (build.currentPlan == -1) return null;
    const stacks = block.plans.get(build.currentPlan).requirements

    return findRequiredItem(stacks, build, core);
}

function getItemRequest(build, block, core) {
    const consumesItems = block.consumes.get(ConsumeType.item);
    if (!consumesItems) return null;

    if (consumesItems instanceof ConsumeItemFilter) {
        return getFilterRequest(consumesItems, build, core);
    } else if (consumesItems instanceof ConsumeItems) {
        return findRequiredItem(consumesItems.items, build, core);
    } else {
        return null;
    }
}

function getFilterRequest(filter, build, core) {
    const items = Vars.content.items();
    const bits = new Bits;
    let bitIndex = 0;
    let item

    filter.applyItemFilter(bits);
    do {
        bitIndex = bits.nextSetBit(bitIndex);

        if (bitIndex == -1) break;
        // ignore blast compound; it will explode generators
        if (bitIndex == 14) {
            bitIndex++;
            continue;
        } 

        item = items.get(bitIndex)
        if (core.items.get(item) >= 20) {
            if (build.acceptStack(item, 20, Vars.player.unit()) >= 5) {
                return item;
            } else {
                return null;
            }
        }
        bitIndex++;
    } while (bitIndex > 0);
    return null;
}

function findRequiredItem(stacks, build, core) {
    for (let itemStack of stacks) {
        let item = itemStack.item;
        if (core.items.get(item) >= 20 && build.acceptStack(item, 20, Vars.player.unit()) >= 5) {
            return item;
        }
    }
    return null;
}
