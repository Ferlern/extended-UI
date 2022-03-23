exports.drawCursor = function(player) {
    if (player == Vars.player) return;

    const unitX = player.x;
    const unitY = player.y;
    const cursorX = player.mouseX;
    const cursorY = player.mouseY;

    Draw.draw(Layer.overlayUI+0.01, run(() => {
        Lines.stroke(1, player.team().color);
        Draw.alpha(0.7);
        Lines.line(unitX, unitY, cursorX, cursorY);
        Draw.reset();
    }));
}
