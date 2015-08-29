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
		'assets/menu-floor.gif',
		'assets/menu-action.gif'
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

	var menuaction = new Image();
	menuaction.src = "assets/menu-action.gif";

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
		var pixels = 4;
		var maxVal = 108;
		return pixels*Math.ceil(((input*maxVal)/100)/pixels);
	}

	function enemyBarDisplay(input)
	{
		var pixels = 3;
		var maxVal = 94;
		return pixels*Math.ceil(((input*maxVal)/100)/pixels);
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

	function drawBG()
	{
		ctx.drawImage(bg, 0, 0, bgSize*scale, bgSize*scale);
		ctx.drawImage(bg, bgSize*scale, 0, bgSize*scale, bgSize*scale);
		ctx.drawImage(menu, 0, 0, 520, 135, 0, textHeight-vText, 520, 135);
	};

	function drawFloor(floorNum)
	{
		ctx.drawImage(menufloor, 0, 0, 150, 50, (520/2)-(150/2), 0, 150, 50);
		niceText("Floor "+floorNum, (520/2)-31, 29);
	};

	function actionMenuPopUp(specialAction)
	{
		ctx.drawImage(menuaction, 0, 0, 82, 135, actionMenu-hText, textHeight-vText, 82, 135);
		niceText("Attack",actionMenu,textHeight+(textSpacing*0));
		niceText("Defend",actionMenu,textHeight+(textSpacing*1));
		niceText(specialAction,actionMenu,textHeight+(textSpacing*2));
		niceText("Magic",actionMenu,textHeight+(textSpacing*3));
		niceText("Item",actionMenu,textHeight+(textSpacing*4));
	};

	function drawChatMenu()
	{
		//chat window
		ctx.drawImage(menuchat, 0, 0, 280, 510, chatWindow, 0, 280, 510);
		//ctx.drawImage(menu, 0, 0, 81, 62, chatWindow, textHeight-vText, 81, 62);
		niceText(player1Name+": ouch.",chatWindow+hText,vText+(textSpacing*0));
		niceText(player5Name+": i am slain...",chatWindow+hText,vText+(textSpacing*1));
		niceText(player2Name+": rezzing",chatWindow+hText,vText+(textSpacing*2));

		//chat text box
		//http://goldfirestudios.com/blog/108/CanvasInput-HTML5-Canvas-Text-Input
		var input = new CanvasInput({
		canvas: document.getElementById('myCanvas'),
		x: chatWindow+10,
		y: 255*2-34,
		fontSize: 16,
		fontFamily: 'Arial',
		fontColor: '#ffffff',
		//fontWeight: 'bold',
		width: 800-chatWindow-27,
		padding: 2,
		borderWidth: 0,
		borderColor: '#0000ff',
		borderRadius: 0,
		boxShadow: '1px 1px 0px #fff',
		backgroundColor: '#1429ab',
		//innerShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
		//placeHolder: player1Name
		});
	};

	function drawEnemy(enemyName, enemyNum, enemyX, enemyY, health)
	{
		enemyText(enemyName,enemyX,enemyY-13);
		//ctx.drawImage(enemybar, 0, 0, 32, 4, enemyX, enemyY-10, 32*scale, 4*scale);
		ctx.drawImage(enemybar, 0, enemyBarDisplay(health), 32, 4, enemyX, enemyY-10, 32*scale, 4*scale);
		ctx.drawImage(imp, 0, 0, enemySmall, enemySmall, enemyX, enemyY, enemySmall*scale, enemySmall*scale);
		niceText(enemyName,hText,textHeight+(textSpacing*(enemyNum-1)));
	};

	function drawPlayer(playerNum)
	{
		if (playerNum == 1)
		{
			drawName = player1Name;
			drawHP = player1hp;
			drawHPMax = player1hpMax;
			drawMP = player1mp;
			drawMPMax = player1mpMax;
			drawRow = player1Row;
			drawHeight = player1;
			drawReady = 25; //ready
			drawPose = player1Pose;
		}
		else if (playerNum == 2)
		{
			drawName = player2Name;
			drawHP = 100;
			drawHPMax = 100;
			drawMP = 100;
			drawMPMax = 100;
			drawRow = player2Row;
			drawHeight = player2;
			drawReady = 119; //ready
			drawPose = player2Pose;
		}
		else if (playerNum == 3)
		{
			drawName = player3Name;
			drawHP = 100;
			drawHPMax = 100;
			drawMP = 100;
			drawMPMax = 100;
			drawRow = player3Row;
			drawHeight = player3;
			drawReady = 175; //ready
			drawPose = player3Pose;
		}
		else if (playerNum == 4)
		{
			drawName = player4Name;
			drawHP = 100;
			drawHPMax = 100;
			drawMP = 100;
			drawMPMax = 100;
			drawRow = player4Row;
			drawHeight = player4;
			drawReady = 55; //ready
			drawPose = player4Pose;
		}
		else if (playerNum == 5)
		{
			drawName = player5Name;
			drawHP = 0;
			drawHPMax = 100;
			drawMP = 0;
			drawMPMax = 100;
			drawRow = player5Row;
			drawHeight = player5;
			drawReady = 0; //ready
			drawPose = player5Pose;
		}
		else
			return;
		niceText(drawName,textPlayerNames,textHeight+(textSpacing*(playerNum-1)));
		niceText("An: "+drawHP+"/"+drawHPMax,textHP,textHeight+(textSpacing*(playerNum-1)));
		niceText("Ps: "+drawMP+"/"+drawMPMax,textMP,textHeight+(textSpacing*(playerNum-1)));
		ctx.drawImage(HPMP, barPercent(drawHP, drawHPMax), 0, 5, 24,drawRow+36, drawHeight, 5*scale, 24*scale);
		ctx.drawImage(HPMP, barPercent(drawMP, drawMPMax), 24, 5, 48, drawRow+48, drawHeight, 5*scale, 24*scale);
		ctx.drawImage(readybar, 0, readyBarDisplay(drawReady), 29, 5, drawRow, drawHeight+charHeight*scale+2, 29*scale, 5*scale);
		if (drawPose!=poseDead)
			ctx.drawImage(hero, drawPose, 0, charWidth, charHeight, drawRow, drawHeight, charWidth*scale, charHeight*scale);
		else
			ctx.drawImage(hero, drawPose, 0, charWidthDead, charHeight, drawRow, drawHeight, charWidthDead*scale, charHeight*scale);
	};

	function drawScene()
	{
		drawBG();
		drawFloor('B1');
		drawChatMenu();

		drawEnemy('Red Imp', 1, 200, 200, 75);

		drawPlayer(1);
		drawPlayer(2);
		drawPlayer(3);
		drawPlayer(4);
		drawPlayer(5);

		actionMenuPopUp('Special');
	};

	function reset()
	{
	};

	//replace this later
	bg.onload = function()
	{
		drawScene();
	};
}

