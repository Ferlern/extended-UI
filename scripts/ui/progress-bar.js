importPackage(Packages.arc.util.pooling);

const factoryProgressBarSize = 4;
const fontScale = 0.25 / Scl.scl(1.0);

const fillSize = factoryProgressBarSize - 2;
const indent = factoryProgressBarSize/2;

let showFactoryProgress = true;

function ProgressBar() {
    this.replace = false;
	this.draw = function(build) {
        if (!showFactoryProgress) return;
        if (build.currentPlan == -1) return;

		let progress = 0;

		if (build instanceof UnitFactory.UnitFactoryBuild) {
			progress = build.progress / build.block.plans.get(build.currentPlan).time;
		} else {
			progress = build.progress / build.block.constructTime;
		}

		if (!progress) return;

        const lay = Pools.obtain(GlyphLayout, prov(()=>{return new GlyphLayout()}));
        const font = Fonts.outline;
        const text = Math.floor(progress*100) + "%";
        const blockPixelSize = build.block.size*8;
        const startX = build.x - blockPixelSize/2 - factoryProgressBarSize;
        const startY = build.y + blockPixelSize/2;
        const endY = startY + factoryProgressBarSize;
        
        Draw.z(Layer.darkness+1);

        Lines.stroke(1, Pal.darkerGray);
        Lines.rect(startX, startY, blockPixelSize + factoryProgressBarSize*2, factoryProgressBarSize);
        Lines.stroke(fillSize, build.team.color);
        // TODO 0% Looked like it was already built by 2 points (because of Lines.stroke)
        Lines.line(startX + indent, startY + factoryProgressBarSize/2, startX + indent + (blockPixelSize + factoryProgressBarSize*2 - indent*2)*progress, startY + factoryProgressBarSize/2);
        
        font.setUseIntegerPositions(false);
        font.getData().setScale(fontScale);
        
        lay.setText(font, text);

        font.setColor(Color.white);
        font.draw(text, build.x - lay.width/2, endY + lay.height/2 + 4);
        font.getData().setScale(1);

        Pools.free(lay);
        Draw.reset();
	}
}

Events.on(ClientLoadEvent, event => {
    Vars.content.blocks().each((block) => {
        let base;
        
        if (block instanceof UnitFactory) {
            base = UnitFactory.UnitFactoryBuild;
        } else if (block instanceof Reconstructor) {
            base = Reconstructor.ReconstructorBuild;
        } else {
            return;
        }

        block.buildType = () => {  
            return extend(base, block, {
                drawables: [
                    new ProgressBar(),
                ],
                draw() {
                    let replaced = false;
                    for (let i = 0; i < this.drawables.length; i++) {
                        if (this.drawables[i].replace) {
                            replaced = true;
                            break;
                        }
                    }
                    if (!replaced) {
                        this.super$draw();
                    }
                    for (let i = 0; i < this.drawables.length; i++) {
                        this.drawables[i].draw(this);
                    }
                }
            });
        }
    });
});
