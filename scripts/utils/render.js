exports.inCamera = function (camera, x, y) {
	return (Math.abs(camera.position.x - x) < camera.width*0.5 && Math.abs(camera.position.y - y) < camera.height*0.5);
}
