window.onload = function()
{
	//create canvas
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	c.width = 800;
	c.height = 255*2;
	ctx.font = "16px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#000000";

	//disable smoothing of scaled-up images
	ctx.webkitImageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;

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
		'assets/imp.gif',
		'assets/bars.gif',
		'assets/menu.gif'
	]);
	resources.onReady(init);

	//assign images
	var bg = new Image();
	bg.src = "assets/cave_bg.png";

	var menu = new Image();
	menu.src = "assets/menu.gif";

	var hero = new Image();
	hero.src = "assets/cecil.gif";

	var HPMP = new Image();
	HPMP.src = "assets/bars.gif";

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
	var frontRow = 400;
	var backRow = frontRow+(charWidth*scale)+charSpacing;

	//spacing of menu text
	var chatWindow = 515;
	var textHeight = 400;
	var actionMenu = 125;
	var textPlayerNames = actionMenu+80;
	var textHP = textPlayerNames+100;
	var textMP = textHP+100;
	var textSpacing = 22;

	//player names
	var player1Name = "PlayerOne";
	var player2Name = "PlayerTwo";
	var player3Name = "PlayerThree";
	var player4Name = "PlayerFour";
	var player5Name = "PlayerFive";

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
	var player1Pose = poseWeak;
	var player2Pose = poseCasting1;
	var player3Pose = poseReady;
	var player4Pose = poseStanding;
	var player5Pose = poseDead;

	//player row selection
	var player1Row = frontRow;
	var player2Row = backRow;
	var player3Row = frontRow;
	var player4Row = frontRow;
	var player5Row = frontRow;

	//player hp/mp
	var player1hp = 1;
	var player1hpMax = 100;
	var player1mp = 55;
	var player1mpMax = 100;

	//calculate the hp/mp bar position
	function barPercent(current, max)
	{
		return 100-5*Math.ceil(((current/max)*100)/5);
	}

	//combine stroke & fill text functions to make outlined text
	function niceText(text, horizontal, vertical)
	{
		ctx.strokeText(text, horizontal, vertical);
		ctx.fillText(text, horizontal, vertical);
	};

	bg.onload = function()
	{
		ctx.drawImage(bg, 0, 0, bgSize*scale, bgSize*scale);

		ctx.drawImage(imp, 0, 0, enemySmall, enemySmall, 200, 200, enemySmall*scale, enemySmall*scale);

		//draw players (alive or dead) and hp/mp bars
		if (player1Pose!=poseDead)
		{
			ctx.drawImage(hero, player1Pose, 0, charWidth, charHeight, player1Row, player1, charWidth*scale, charHeight*scale);
			ctx.drawImage(HPMP, barPercent(player1hp, player1hpMax), 0, 5, 24, player1Row+35, player1, 5*scale, 24*scale);
			ctx.drawImage(HPMP, barPercent(player1mp, player1mpMax), 24, 5, 48, player1Row+47, player1, 5*scale, 24*scale);
		}
		else
		{
			ctx.drawImage(hero, player1Pose, 0, charWidthDead, charHeight, player1Row, player1, charWidthDead*scale, charHeight*scale);
			ctx.drawImage(HPMP, 100, 0, 5, 24, player1Row+50, player1, 5*scale, 24*scale);
			ctx.drawImage(HPMP, 100, 24, 5, 48, player1Row+62, player1, 5*scale, 24*scale);
		}
		if (player2Pose!=poseDead)
		{
			ctx.drawImage(hero, player2Pose, 0, charWidth, charHeight, player2Row, player2, charWidth*scale, charHeight*scale);
			ctx.drawImage(HPMP, 0, 0, 5, 24, player2Row+35, player2, 5*scale, 24*scale);
			ctx.drawImage(HPMP, 0, 24, 5, 48, player2Row+47, player2, 5*scale, 24*scale);
		}
		else
		{
			ctx.drawImage(hero, player2Pose, 0, charWidthDead, charHeight, player2Row, player2, charWidthDead*scale, charHeight*scale);
			ctx.drawImage(HPMP, 100, 0, 5, 24, player2Row+50, player2, 5*scale, 24*scale);
			ctx.drawImage(HPMP, 100, 24, 5, 48, player2Row+62, player2, 5*scale, 24*scale);
		}
		if (player3Pose!=poseDead)
		{
			ctx.drawImage(hero, player3Pose, 0, charWidth, charHeight, player3Row, player3, charWidth*scale, charHeight*scale);
			ctx.drawImage(HPMP, 0, 0, 5, 24, player3Row+35, player3, 5*scale, 24*scale);
			ctx.drawImage(HPMP, 0, 24, 5, 48, player3Row+47, player3, 5*scale, 24*scale);
		}
		else
		{
			ctx.drawImage(hero, player3Pose, 0, charWidthDead, charHeight, player3Row, player3, charWidthDead*scale, charHeight*scale);
			ctx.drawImage(HPMP, 100, 0, 5, 24, player3Row+50, player3, 5*scale, 24*scale);
			ctx.drawImage(HPMP, 100, 24, 5, 48, player3Row+62, player3, 5*scale, 24*scale);
		}
		if (player4Pose!=poseDead)
		{
			ctx.drawImage(hero, player4Pose, 0, charWidth, charHeight, player4Row, player4, charWidth*scale, charHeight*scale);
			ctx.drawImage(HPMP, 0, 0, 5, 24, player4Row+35, player4, 5*scale, 24*scale);
			ctx.drawImage(HPMP, 0, 24, 5, 48, player4Row+47, player4, 5*scale, 24*scale);
		}
		else
		{
			ctx.drawImage(hero, player4Pose, 0, charWidthDead, charHeight, player4Row, player4, charWidthDead*scale, charHeight*scale);
			ctx.drawImage(HPMP, 100, 0, 5, 24, player4Row+50, player4, 5*scale, 24*scale);
			ctx.drawImage(HPMP, 100, 24, 5, 48, player4Row+62, player4, 5*scale, 24*scale);
		}
		if (player5Pose!=poseDead)
		{
			ctx.drawImage(hero, player5Pose, 0, charWidth, charHeight, player1Row, player5, charWidth*scale, charHeight*scale);
		}
		else
		{
			ctx.drawImage(hero, player5Pose, 0, charWidthDead, charHeight, player1Row, player5, charWidthDead*scale, charHeight*scale);
			ctx.drawImage(HPMP, 100, 0, 5, 24, player5Row+50, player5, 5*scale, 24*scale);
			ctx.drawImage(HPMP, 100, 24, 5, 48, player5Row+62, player5, 5*scale, 24*scale);
		}

		//enemy list menu
		ctx.drawImage(menu, 0, textHeight-25);
		niceText("Imp",15,textHeight+(textSpacing*0));

		//action menu
		ctx.drawImage(menu, actionMenu-15, textHeight-25);
		niceText("Attack",actionMenu,textHeight+(textSpacing*0));
		niceText("Special",actionMenu,textHeight+(textSpacing*1));
		niceText("Magic",actionMenu,textHeight+(textSpacing*2));
		niceText("Item",actionMenu,textHeight+(textSpacing*3));

		//player names text menu
		ctx.drawImage(menu, textPlayerNames-15, textHeight-25);
		niceText(player1Name,textPlayerNames,textHeight);
		niceText("HP: "+player1hp+"/"+player1hpMax,textHP,textHeight+(textSpacing*0));
		niceText("MP: 100/100",textMP,textHeight+(textSpacing*0));

		niceText(player2Name,textPlayerNames,textHeight+(textSpacing*1));
		niceText("HP: 100/100",textHP,textHeight+(textSpacing*1));
		niceText("MP: 100/100",textMP,textHeight+(textSpacing*1));

		niceText(player3Name,textPlayerNames,textHeight+(textSpacing*2));
		niceText("HP: 100/100",textHP,textHeight+(textSpacing*2));
		niceText("MP: 100/100",textMP,textHeight+(textSpacing*2));

		niceText(player4Name,textPlayerNames,textHeight+(textSpacing*3));
		niceText("HP: 100/100",textHP,textHeight+(textSpacing*3));
		niceText("MP: 100/100",textMP,textHeight+(textSpacing*3));

		niceText(player5Name,textPlayerNames,textHeight+(textSpacing*4));
		niceText("HP: 0/100",textHP,textHeight+(textSpacing*4));
		niceText("MP: 100/100",textMP,textHeight+(textSpacing*4));

		//chat window
		ctx.drawImage(menu, chatWindow-15, 0);
		niceText("PlayerOne: ouch.",chatWindow,25+(textSpacing*0));
		niceText("PlayerFive: i am slain...",chatWindow,25+(textSpacing*1));
		niceText("PlayerTwo: rezzing",chatWindow,25+(textSpacing*2));
	}

	function reset()
	{
	}
}

