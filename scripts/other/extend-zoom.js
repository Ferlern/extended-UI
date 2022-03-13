const minZoom = 0.5;
const maxZoom = 25;

function setZoom(min, max) {
    Vars.renderer.minZoom = min;
    Vars.renderer.maxZoom = max;
}

setZoom(minZoom, maxZoom);
