exports.drawLogicLine = function(unit) {
    const unitX = unit.x;
    const unitY = unit.y;
    const processor = unit.controller.controller;
    const processorX = processor.x;
    const processorY = processor.y;

    Draw.draw(Layer.overlayUI+0.01, run(() => {
        Lines.stroke(1, Color.purple);
        Draw.alpha(0.7);
        Lines.line(unitX, unitY, processorX, processorY);
        Draw.reset();
    }));
}
