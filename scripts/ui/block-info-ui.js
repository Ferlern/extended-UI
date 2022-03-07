Events.run(Trigger.update, () => {
    let x = Core.input.mouseX();
    let y = Core.input.mouseY();

    let pos = Core.input.mouseWorld(x, y);
    let mouseTile = Vars.world.tileWorld(pos.x, pos.y);
    let block = mouseTile.block();

    if (!block) return;
});
