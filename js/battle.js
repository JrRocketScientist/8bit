window.onload = function()
{
	//create canvas
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	c.width = 800;
	c.height = 255*2;
	ctx.font = "20px Arial";
	ctx.fillStyle = "#ffffff";

	// main game loop
	var lastTime;
	function main()
	{
		var now = Date.now();
		var dt = (now - lastTime) / 1000.0;
		update(dt);
		render();
		lastTime = now;
		requestAnimFrame(main);
	};

	function init()
	{
		reset();
		lastTime = Date.now();
		main();
	}

	resources.load([
		'assets/cave_bg.png',
		'assets/cecil.gif',
		'assets/imp.gif'
	]);
	resources.onReady(init);

	//disable smoothing of scaled-up images
	ctx.webkitImageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;

	var bg = new Image();
	bg.src = "assets/cave_bg.png";

	var hero = new Image();
	hero.src = "assets/cecil.gif";

	var imp = new Image();
	imp.src = "assets/imp.gif";

	//background, enemy and player size variables
	var scale = 2;
	var bgSize = 256;
	var enemySmall = 32;
	var charWidth = 16;
	var charWidthDead = 23;
	var charHeight = 24;

	//player horizontal and vertical spacing
	var charSpacing = 5;
	var player1 = 100;
	var player2 = player1+(charHeight*scale)+charSpacing;
	var player3 = player2+(charHeight*scale)+charSpacing;
	var player4 = player3+(charHeight*scale)+charSpacing;
	var player5 = player4+(charHeight*scale)+charSpacing;
	var frontRow = 700;
	var backRow = frontRow+(charWidth*scale)+charSpacing;

	//vertical spacing of lower text
	var textHeight = 400;

	//spacing of player names
	var textSpacing = 22;
	var textPlayerNames = 600;
	var player1Name = "Player 1";
	var player2Name = "Player 2";
	var player3Name = "Player 3";
	var player4Name = "Player 4";
	var player5Name = "Player 5";

	//character poses on sprite sheet
	var poseStanding = 0;
	var poseWalking = (charWidth+1)*1;
	var poseReady = (charWidth+1)*2;
	var poseAttack1 = (charWidth+1)*3;
	var poseAttack2 = (charWidth+1)*4;
	var poseAttack3 = (charWidth+1)*5;
	var poseHit = (charWidth+1)*6;
	var poseCasting1 = (charWidth+1)*7;
	var poseCasting2 = (charWidth+1)*8;
	var poseWin = (charWidth+1)*9;
	var poseWeak = (charWidth+1)*10;
	var poseDead = (charWidth+1)*11;

	//player poses
	var player1Pose = poseStanding;
	var player2Pose = poseCasting1;
	var player3Pose = poseReady;
	var player4Pose = poseWeak;
	var player5Pose = poseDead;

	//player row selection
	var player1Row = frontRow;
	var player2Row = backRow;
	var player3Row = frontRow;
	var player4Row = frontRow;
	var player5Row = frontRow;

	bg.onload = function()
	{
		ctx.drawImage(bg, 0, 0, bgSize*scale, bgSize*scale);
		ctx.drawImage(bg, bgSize*scale, 0, bgSize*scale, bgSize*scale);

		ctx.drawImage(imp, 0, 0, enemySmall, enemySmall, 300, 200, enemySmall*scale, enemySmall*scale);

		if (player1Pose!=poseDead)
			ctx.drawImage(hero, player1Pose, 0, charWidth, charHeight, player1Row, player1, charWidth*scale, charHeight*scale);
		else
			ctx.drawImage(hero, player1Pose, 0, charWidthDead, charHeight, player1Row, player1, charWidthDead*scale, charHeight*scale);
		if (player2Pose!=poseDead)
			ctx.drawImage(hero, player2Pose, 0, charWidth, charHeight, player2Row, player2, charWidth*scale, charHeight*scale);
		else
			ctx.drawImage(hero, player2Pose, 0, charWidthDead, charHeight, player2Row, player2, charWidthDead*scale, charHeight*scale);
		if (player3Pose!=poseDead)
			ctx.drawImage(hero, player3Pose, 0, charWidth, charHeight, player3Row, player3, charWidth*scale, charHeight*scale);
		else
			ctx.drawImage(hero, player3Pose, 0, charWidthDead, charHeight, player3Row, player3, charWidthDead*scale, charHeight*scale);
		if (player4Pose!=poseDead)
			ctx.drawImage(hero, player4Pose, 0, charWidth, charHeight, player4Row, player4, charWidth*scale, charHeight*scale);
		else
			ctx.drawImage(hero, player4Pose, 0, charWidthDead, charHeight, player4Row, player4, charWidthDead*scale, charHeight*scale);
		if (player5Pose!=poseDead)
			ctx.drawImage(hero, player5Pose, 0, charWidth, charHeight, player1Row, player5, charWidth*scale, charHeight*scale);
		else
			ctx.drawImage(hero, player5Pose, 0, charWidthDead, charHeight, player1Row, player5, charWidthDead*scale, charHeight*scale);

		ctx.fillText(player1Name,textPlayerNames,textHeight);
		ctx.fillText(player2Name,textPlayerNames,textHeight+(textSpacing*1));
		ctx.fillText(player3Name,textPlayerNames,textHeight+(textSpacing*2));
		ctx.fillText(player4Name,textPlayerNames,textHeight+(textSpacing*3));
		ctx.fillText(player5Name,textPlayerNames,textHeight+(textSpacing*4));
	}

	function reset()
	{
	}
}

