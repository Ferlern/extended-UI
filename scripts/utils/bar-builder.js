importPackage(Packages.arc.util.pooling);

const fontScale = 0.25 / Scl.scl(1.0);

exports.draw = function(drawX, drawY, value, targetSizeInBlocks, barSize, labelText, color, alpha) {
    if (!value) return;
    
    const lay = Pools.obtain(GlyphLayout, prov(()=>{return new GlyphLayout()}));
    const font = Fonts.outline;
    const fillSize = barSize - 2;
    const indent = barSize/2;
    const blockPixelSize = targetSizeInBlocks*8;
    const startX = drawX - blockPixelSize/2 - barSize;
    const startY = drawY + blockPixelSize/2;
    const endY = startY + barSize;
    
    Draw.z(Layer.darkness+1);

    Lines.stroke(1, Pal.darkerGray);
    Draw.alpha(alpha);
    Lines.rect(startX, startY, blockPixelSize + barSize*2, barSize);
    Lines.stroke(fillSize, color);
    Draw.alpha(alpha);
    // TODO 0% Looked like it was already built by 2 points (because of Lines.stroke)
    Lines.line(startX + indent, startY + barSize/2, startX + indent + (blockPixelSize + barSize*2 - indent*2)*value, startY + barSize/2);
    
    font.setUseIntegerPositions(false);
    font.getData().setScale(fontScale);
    
    lay.setText(font, labelText);

    font.setColor(Color.white);
    font.draw(labelText, drawX - lay.width/2, endY + lay.height/2 + 4);
    font.getData().setScale(1);

    Pools.free(lay);
    Draw.reset();
}

exports.buildPercentLabel = function(value) {
    return Math.floor(value*100) + "%";
}

exports.buildValueLabel = function(value) {
    // might be useful in future
}
