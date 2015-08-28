window.onload = function()
{
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.font = "30px Arial";
	ctx.fillStyle = "#ffffff";

	ctx.webkitImageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;

	var bg = new Image();
	var hero = new Image();
	var charWidth = 16;
	var charHeight = 24;
	var bgSize = 256;
	var scale = 3;

	bg.onload = function ()
	{
		ctx.drawImage(bg, 0, 0, bgSize*scale, bgSize*scale);
		ctx.drawImage(bg, bgSize*scale, 0, bgSize*scale, bgSize*scale);
		ctx.drawImage(hero, 0, 0, charWidth, charHeight, 200, 200, charWidth*scale, charHeight*scale);
		ctx.fillText("Hello World",10,300);
	}
	bg.src = "assets/cave_bg.png";
	hero.src = "assets/cecil.gif";
}

