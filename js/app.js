window.onload = function() {
	console.log("DOM is Ready!");
};

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function draw() {

		/*Build Land Area*/
	ctx.fillStyle = '#668d3c';
	ctx.fillRect(0, 450, 700, 50);

		/*Base Locations*/
	ctx.fillStyle = 'rgb(200, 0 , 0)';
	ctx.fillRect(60, 430, 40, 30);
	ctx.fillRect(160, 430, 40, 30);
	ctx.fillRect(260, 430, 40, 30);
	ctx.fillRect(380, 430, 40, 30);
	ctx.fillRect(480, 430, 40, 30);
	ctx.fillRect(580, 430, 40, 30);

		/*Missile Silo Locations*/
	ctx.fillStyle = 'rgb(0, 0, 200)';
	ctx.fillRect(10, 430, 30, 30);
	ctx.fillRect(325, 430, 30, 30);
	ctx.fillRect(640, 430, 30, 30);	
}














draw();