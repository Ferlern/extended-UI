exports.draw = function(plans) {
    Draw.draw(Layer.plans + 0.01, ()=>{
        const echable = new Eachable(plans);
        plans.forEach(plan => {
            plan.block.drawRequestRegion(plan, echable);
            plan.block.drawRequestConfigTop(plan, echable);
        });
    });
}

exports.drawOne = function(plan) {
    exports.draw([plan]);
}
