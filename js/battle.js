window.onload = function()
{
	//create canvas
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	c.width = 800;
	c.height = 255*2;
	//ctx.font = "16px Arial";
	//ctx.fillStyle = "#ffffff";
	//ctx.lineWidth = 2;
	//ctx.strokeStyle = "#000000";

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
		'assets/enemybar.gif',
		'assets/imp.gif',
		'assets/bars.gif',
		'assets/readybar.gif',
		'assets/menu.gif',
		'assets/menu-chat.gif',
		'assets/menu-floor.gif'
	]);
	resources.onReady(init);

	//assign images
	var bg = new Image();
	bg.src = "assets/cave_bg.png";

	var menu = new Image();
	menu.src = "assets/menu.gif";

	var menuchat = new Image();
	menuchat.src = "assets/menu-chat.gif";

	var menufloor = new Image();
	menufloor.src = "assets/menu-floor.gif";

	var hero = new Image();
	hero.src = "assets/cecil.gif";

	var HPMP = new Image();
	HPMP.src = "assets/bars.gif";

	var readybar = new Image();
	readybar.src = "assets/readybar.gif";

	var imp = new Image();
	imp.src = "assets/imp.gif";

	var enemybar = new Image();
	enemybar.src = "assets/enemybar.gif";

	//background, enemy and player size variables
	var scale = 2;
	var bgSize = 256;
	var enemySmall = 32;
	var charWidth = 16;
	var charWidthDead = 23;
	var charHeight = 24;

	//player horizontal and vertical spacing
	var charSpacing = 15;
	var player1 = 60;
	var player2 = player1+(charHeight*scale)+charSpacing;
	var player3 = player2+(charHeight*scale)+charSpacing;
	var player4 = player3+(charHeight*scale)+charSpacing;
	var player5 = player4+(charHeight*scale)+charSpacing;
	var frontRow = 425;
	var backRow = frontRow+(charWidth*scale);

	//spacing of menu text
	var chatWindow = 520;
	var textHeight = 402;
	var actionMenu = 118;
	var textPlayerNames = actionMenu+81;
	var textHP = textPlayerNames+100;
	var textMP = textHP+110;
	var textSpacing = 22;
	var hText = 15;
	var vText = 27;

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

	//player row selection
	var player1Row = frontRow;
	var player2Row = backRow;
	var player3Row = frontRow;
	var player4Row = frontRow;
	var player5Row = frontRow;

	//player hp/mp
	var player1hp = 12;
	var player1hpMax = 100;
	var player1mp = 55;
	var player1mpMax = 100;

	//player poses
	if (player1hp/player1hpMax < 1/8)
		var player1Pose = poseWeak;
	else
		var player1Pose = poseReady;
	var player2Pose = poseCasting1;
	var player3Pose = poseReady;
	var player4Pose = poseStanding;
	var player5Pose = poseDead;

	//calculate the hp/mp bar position
	function barPercent(current, max)
	{
		return 100-5*Math.ceil(((current/max)*100)/5);
	}

	function readyBarDisplay(input)
	{
		var maxVal = 108;
		return 4*Math.ceil(((input*maxVal)/100)/4);
	}

	//combine stroke & fill text functions to make outlined text
	function niceText(text, horizontal, vertical)
	{
		ctx.font = "16px Arial";
		ctx.fillStyle = "#ffffff";
		//ctx.strokeText(text, horizontal, vertical);
		ctx.fillText(text, horizontal, vertical);
	};

	function enemyText(text, horizontal, vertical)
	{
		ctx.font = "11px Arial";
		ctx.fillStyle = "#ffffff";
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#000000";
		ctx.strokeText(text, horizontal, vertical);
		ctx.fillText(text, horizontal, vertical);
	};

	bg.onload = function()
	{
		ctx.drawImage(bg, 0, 0, bgSize*scale, bgSize*scale);
		ctx.drawImage(bg, bgSize*scale, 0, bgSize*scale, bgSize*scale);

		//draw enemies
		enemyText("Red Imp",200,187);
		ctx.drawImage(enemybar, 0, 0, 32, 4, 200, 190, 32*scale, 4*scale);
		ctx.drawImage(imp, 0, 0, enemySmall, enemySmall, 200, 200, enemySmall*scale, enemySmall*scale);

		//draw player 1
		ctx.drawImage(HPMP, barPercent(player1hp, player1hpMax), 0, 5, 24, player1Row+36, player1, 5*scale, 24*scale);
		ctx.drawImage(HPMP, barPercent(player1mp, player1mpMax), 24, 5, 48, player1Row+48, player1, 5*scale, 24*scale);
		ctx.drawImage(readybar, 0, readyBarDisplay(25), 29, 5, player1Row, player1+charHeight*scale+2, 29*scale, 5*scale);
		if (player1Pose!=poseDead)
			ctx.drawImage(hero, player1Pose, 0, charWidth, charHeight, player1Row, player1, charWidth*scale, charHeight*scale);
		else
			ctx.drawImage(hero, player1Pose, 0, charWidthDead, charHeight, player1Row, player1, charWidthDead*scale, charHeight*scale);

		//draw player 2
		ctx.drawImage(HPMP, 0, 0, 5, 24, player2Row+36, player2, 5*scale, 24*scale);
		ctx.drawImage(HPMP, 0, 24, 5, 48, player2Row+48, player2, 5*scale, 24*scale);
		ctx.drawImage(readybar, 0, readyBarDisplay(119), 29, 5, player2Row, player2+charHeight*scale+2, 29*scale, 5*scale);
		if (player2Pose!=poseDead)
			ctx.drawImage(hero, player2Pose, 0, charWidth, charHeight, player2Row, player2, charWidth*scale, charHeight*scale);
		else
			ctx.drawImage(hero, player2Pose, 0, charWidthDead, charHeight, player2Row, player2, charWidthDead*scale, charHeight*scale);

		//draw player 3
		ctx.drawImage(HPMP, 0, 0, 5, 24, player3Row+36, player3, 5*scale, 24*scale);
		ctx.drawImage(HPMP, 0, 24, 5, 48, player3Row+48, player3, 5*scale, 24*scale);
		ctx.drawImage(readybar, 0, readyBarDisplay(175), 29, 5, player3Row, player3+charHeight*scale+2, 29*scale, 5*scale);
		if (player3Pose!=poseDead)
			ctx.drawImage(hero, player3Pose, 0, charWidth, charHeight, player3Row, player3, charWidth*scale, charHeight*scale);
		else
			ctx.drawImage(hero, player3Pose, 0, charWidthDead, charHeight, player3Row, player3, charWidthDead*scale, charHeight*scale);

		//draw player 4
		ctx.drawImage(HPMP, 0, 0, 5, 24, player4Row+36, player4, 5*scale, 24*scale);
		ctx.drawImage(HPMP, 0, 24, 5, 48, player4Row+48, player4, 5*scale, 24*scale);
		ctx.drawImage(readybar, 0, readyBarDisplay(55), 29, 5, player4Row, player4+charHeight*scale+2, 29*scale, 5*scale);
		if (player4Pose!=poseDead)
			ctx.drawImage(hero, player4Pose, 0, charWidth, charHeight, player4Row, player4, charWidth*scale, charHeight*scale);
		else
			ctx.drawImage(hero, player4Pose, 0, charWidthDead, charHeight, player4Row, player4, charWidthDead*scale, charHeight*scale);

		//draw player 5
		ctx.drawImage(HPMP, 100, 0, 5, 24, player5Row+36, player5, 5*scale, 24*scale);
		ctx.drawImage(HPMP, 100, 24, 5, 48, player5Row+48, player5, 5*scale, 24*scale);
		ctx.drawImage(readybar, 0, readyBarDisplay(0), 29, 5, player5Row, player5+charHeight*scale+2, 29*scale, 5*scale);
		if (player5Pose!=poseDead)
			ctx.drawImage(hero, player5Pose, 0, charWidth, charHeight, player1Row, player5, charWidth*scale, charHeight*scale);
		else
			ctx.drawImage(hero, player5Pose, 0, charWidthDead, charHeight, player1Row, player5, charWidthDead*scale, charHeight*scale);

		//floor
		ctx.drawImage(menufloor, 0, 0, 150, 50, (520/2)-(150/2), 0, 150, 50);
		niceText("Floor B1", (520/2)-31, 29);

		//enemy list menu
		ctx.drawImage(menu, 0, 0, 520, 135, 0, textHeight-vText, 520, 135);
		niceText("Red Imp",hText,textHeight+(textSpacing*0));

		//action menu
		niceText("Attack",actionMenu,textHeight+(textSpacing*0));
		niceText("Defend",actionMenu,textHeight+(textSpacing*1));
		niceText("Special",actionMenu,textHeight+(textSpacing*2));
		niceText("Magic",actionMenu,textHeight+(textSpacing*3));
		niceText("Item",actionMenu,textHeight+(textSpacing*4));

		//player names text menu
		niceText(player1Name,textPlayerNames,textHeight);
		niceText("An: "+player1hp+"/"+player1hpMax,textHP,textHeight+(textSpacing*0));
		niceText("Ps: "+player1mp+"/"+player1mpMax,textMP,textHeight+(textSpacing*0));

		niceText(player2Name,textPlayerNames,textHeight+(textSpacing*1));
		niceText("An: 100/100",textHP,textHeight+(textSpacing*1));
		niceText("Ps: 100/100",textMP,textHeight+(textSpacing*1));

		niceText(player3Name,textPlayerNames,textHeight+(textSpacing*2));
		niceText("An: 100/100",textHP,textHeight+(textSpacing*2));
		niceText("Ps: 100/100",textMP,textHeight+(textSpacing*2));

		niceText(player4Name,textPlayerNames,textHeight+(textSpacing*3));
		niceText("An: 100/100",textHP,textHeight+(textSpacing*3));
		niceText("Ps: 100/100",textMP,textHeight+(textSpacing*3));

		niceText(player5Name,textPlayerNames,textHeight+(textSpacing*4));
		niceText("An: 0/100",textHP,textHeight+(textSpacing*4));
		niceText("Ps: 0/100",textMP,textHeight+(textSpacing*4));

		//chat window
		ctx.drawImage(menuchat, 0, 0, 280, 510, chatWindow, 0, 280, 510);
		//ctx.drawImage(menu, 0, 0, 81, 62, chatWindow, textHeight-vText, 81, 62);
		niceText("PlayerOne: ouch.",chatWindow+hText,vText+(textSpacing*0));
		niceText("PlayerFive: i am slain...",chatWindow+hText,vText+(textSpacing*1));
		niceText("PlayerTwo: rezzing",chatWindow+hText,vText+(textSpacing*2));

		//http://goldfirestudios.com/blog/108/CanvasInput-HTML5-Canvas-Text-Input
		var input = new CanvasInput({
		canvas: document.getElementById('myCanvas'),
		x: chatWindow+10,
		y: 255*2-34,
		fontSize: 16,
		fontFamily: 'Arial',
		fontColor: '#000000',
		//fontWeight: 'bold',
		width: 800-chatWindow-27,
		padding: 2,
		borderWidth: 0,
		borderColor: '#0000ff',
		borderRadius: 0,
		boxShadow: '1px 1px 0px #fff',
		//innerShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
		placeHolder: player1Name
		});
	}

	function reset()
	{
	}
}

