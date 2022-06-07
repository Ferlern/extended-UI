exports.draw = function(plans) {
    Draw.draw(Layer.plans + 0.01, ()=>{
        plans.forEach(plan => {
            plan.block.drawRequestRegion(plan, new Eachable(plans));
            plan.block.drawRequestConfigTop(plan, new Eachable(plans));
        });
    });
}

exports.drawOne = function(plan) {
    exports.draw([plan]);
}
