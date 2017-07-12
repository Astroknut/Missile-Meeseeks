window.onload = function() {
	console.log("DOM is Ready!");
};

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function draw() {
	ctx.fillStyle = 'rgb(200, 0 , 0)';
	ctx.fillRect(10, 10, 50, 50);

	ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
	ctx.fillRect(300, 300, 50, 50);
}














draw();