exports.drawCursor = function(player) {
    //For Players who's set up don't show the system cursor properly, at all or for the hell of it
    if (player == Vars.player && !Core.settings.getBool("eui-ShowOwnCursor", true)) return;

    const unitX = player.x;
    const unitY = player.y;
    const cursorX = player.mouseX;
    const cursorY = player.mouseY;
    const style = Core.settings.getInt("eui-playerCursorStyle");

     if (style == 1) { //square (Inspired from Mindustry Ranked Server's spectator mode )
         Draw.draw(Layer.overlayUI+0.01, () => {
             Drawf.square(cursorX, cursorY, 2, player.team().color);
             Draw.alpha(0.7);
             Draw.reset();
         }); return;
     } else if (style == 2) { //square + line
         Draw.draw(Layer.overlayUI+0.01, () => {
             Lines.stroke(1, player.team().color);
             Draw.alpha(0.7);
             Lines.line(unitX, unitY, cursorX, cursorY);
             Draw.reset();
         });
         Draw.draw(Layer.overlayUI+0.01, () => {
             Drawf.square(cursorX, cursorY, 2, player.team().color);
             Draw.alpha(0.7);
             Draw.reset();
         }); return;
     } else if (style == 3) { //Circle
         Draw.draw(Layer.overlayUI+0.01, () => {
             Drawf.circles(cursorX, cursorY, 1, player.team().color);
             Draw.alpha(0.7);
             Draw.reset();
         }); return;
     } else if (style == 4) { //Circle + line
         Draw.draw(Layer.overlayUI+0.01, () => {
             Lines.stroke(1, player.team().color);
             Draw.alpha(0.7);
             Lines.line(unitX, unitY, cursorX, cursorY);
             Draw.reset();
         });
         Draw.draw(Layer.overlayUI+0.01, () => {
             Drawf.circles(cursorX, cursorY, 1, player.team().color);
             Draw.alpha(0.7);
             Draw.reset();
         }); return;
     } else if (style == 5) { //Target
         Draw.draw(Layer.overlayUI+0.01, () => {
             Drawf.target(cursorX, cursorY, 3, player.team().color);
             Draw.alpha(0.7);
             Draw.reset();
         }); return;
     } else if (style == 6) { // Target + Line
         Draw.draw(Layer.overlayUI+0.01, () => {
             Lines.stroke(1, player.team().color);
             Draw.alpha(0.7);
             Lines.line(unitX, unitY, cursorX, cursorY);
             Draw.reset();
         });
         Draw.draw(Layer.overlayUI+0.01, () => {
             Drawf.target(cursorX, cursorY, 3, player.team().color);
             Draw.alpha(0.7);
             Draw.reset();
         }); return;
     } else { //Line (original)
         Draw.draw(Layer.overlayUI+0.01, () => {
             Lines.stroke(1, player.team().color);
             Draw.alpha(0.7);
             Lines.line(unitX, unitY, cursorX, cursorY);
             Draw.reset();
         });
     }
}