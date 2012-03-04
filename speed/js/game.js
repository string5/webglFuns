//========================================================================//
//      Copyright 2012, Smilodon Studio Inc.
//      All rights reserved.
//========================================================================//

/**
 *	game 
 *      @author: CYS
 */


var canvas;
var gl;
var infoPad;

var timer = {time: 0, dtime: 0, startime: Date.now(), lasttime: Date.now() };
var mouse = {x: 0, y: 0, x0: 0, y0: 0, dx: 0, dy: 0, down: false};

var cameraFPS;
var boat;
var terrain;
var skyBox;
var iceGround;
var polys = [];

var maxSpeed = 5;

// ----------------------------------------------------------------------------
// initlalize

function canvasResize()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	attribs = { antialias:true };
	if(!gl) gl = initWebGL(canvas,attribs);
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;

	if(!cameraFPS)cameraFPS = new camera();
	cameraFPS.setProj(50, gl.viewportWidth, gl.viewportHeight, 1, 15000);
	cameraFPS.pos.e[1] = 13; 


}

function init() 
{
	canvas = document.getElementById('webgl-canvas');
	canvasResize();
	
	var touchable = 'createTouch' in document;
	if (touchable)
	{
		canvas.addEventListener('touchstart', onTouchStart, false);
		canvas.addEventListener('touchmove', onTouchMove, false);
		canvas.addEventListener('touchend', onTouchEnd, false);
	}
	else
	{
		canvas.addEventListener('mousedown', onTouchStart, false);
		canvas.addEventListener('mousemove', onTouchMove, false);
		canvas.addEventListener('mouseup', onTouchEnd, false);
		window.addEventListener('keydown', onKeyDown, false);
		window.addEventListener('keyup', onKeyUp, false);
	}

	canvas.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	infoPad = new infoPad();
	infoPad.add("Speed game", "@Smilodon Studio");
	infoPad.add("mouse.dx", mouse.dx);
	infoPad.add("mouse.dy", mouse.dy);


	var cubeFiles = 
		[
			"./res/posx.jpg",
			"./res/negx.jpg",
			"./res/posy.jpg",
			"./res/negy.jpg",
			"./res/posz.jpg",
			"./res/negz.jpg"
		];

	skyBox = new sky(cubeFiles);
	iceGround = new water(cubeFiles);

	boat = new model("./res/ting.json", "./res/ting.jpg");
	terrain = new model("./res/shan.json", "./res/shan_Diffuse.jpg");
	
//	for(var i = 0; i < 1; i++)
//	{
//		var p = new poly();
//		polys.push(p);
//	}
}


// ----------------------------------------------------------------------------
// scene

function drawScene()
{
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

	gl.clearColor(0.0, 0.72, 0.9, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// camera
	if(mouse.down)
	{
		if(mouse.dx > 200 ) mouse.dx = 200;
		if(mouse.dx < -200 ) mouse.dx = -200;

		cameraFPS.vYaw = mouse.dx*0.0001;
		cameraFPS.vPitch = mouse.dy*0.0001;
		boat.vx = mouse.dx*0.003;
		boat.vz = mouse.dy*0.003;
	}
	
	cameraFPS.vYaw *= 0.89;
	cameraFPS.yaw += cameraFPS.vYaw;
	
	cameraFPS.vPitch *= 0.78;
	cameraFPS.pitch += cameraFPS.vPitch;
	if(cameraFPS.pitch > Math.PI*0.03 ) cameraFPS.pitch = Math.PI*0.03;
	if(cameraFPS.pitch < -Math.PI*0.02 ) cameraFPS.pitch = -Math.PI*0.02;
	
	cameraFPS.vx *= 0.98;
	cameraFPS.vz *= 0.98;
	cameraFPS.pos.e[0] += cameraFPS.vx;
	cameraFPS.pos.e[2] += cameraFPS.vz;
	cameraFPS.setView2(cameraFPS.pos, cameraFPS.pitch*0.9, cameraFPS.yaw);

	
	// skyBox
	gl.disable(gl.DEPTH_TEST);
	var matIVP = matMul(cameraFPS.matProj, cameraFPS.matSkyView);
	skyBox.draw(matIVP.inverse());
	
	// scene
	gl.enable(gl.DEPTH_TEST);
	
	// terrain
	// polys
	//	for(var i = 0; i < polys.length; i++)
	//	{
	//		polys[i].set();
	//		polys[i].setMVP(cameraFPS.matVP);
	//		polys[i].draw();		
	//	}

	terrain.set();
	terrain.setMVP(cameraFPS.matVP);
	terrain.draw();

	// boat
	boat.set();
	boat.vx *= 0.98;
	boat.vz *= 0.98;
	boat.x += boat.vx;
	boat.z += boat.vz;
	
	var axisY = new vec3(0, 1, 0);
	var axisZ = new vec3(0, 0, 1);
	var matT = mat4.makeTranslate(	cameraFPS.pos.e[0] + 47*Math.sin(cameraFPS.yaw), 1,  
					cameraFPS.pos.e[2] - 47*Math.cos(cameraFPS.yaw));
	var matR0 = mat4.makeRotate(-Math.PI/2, axisY);
	
	boat.pitch = lerp(-mouse.dx*0.001, boat.oldPitch, 0.1);
	boat.oldPitch = boat.pitch;
	var matR1 = mat4.makeRotate(boat.pitch, axisZ);
	var matR2 = mat4.rotateXY(-cameraFPS.pitch, -cameraFPS.yaw);

	var matMVP = matMul(cameraFPS.matVP, matT.x(matR2).x(matR1).x(matR0) );

	boat.setMVP(matMVP);
	boat.draw();


	var matMirror = new mat4([1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
	var matMVPM = matMul(cameraFPS.matVP, matMirror.x(matT) );
	boat.setMVP(matMVPM);
	boat.draw();

	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.BLEND);
		
	iceGround.draw(cameraFPS.matVP);
	
	infoPad.show();

}

// ----------------------------------------------------------------------------
// Input Proccess

function onKeyUp(event)
{
	// `~
	if(event.keyCode == 192)infoPad.visble = ! infoPad.visble;
	
	//infoPad.add("键盘码", event.keyCode);
	
};

function onKeyDown(event)
{
	if(event.keyCode == 87) onSpeedKey0(1, 1);// W
	if(event.keyCode == 83) onSpeedKey0(-1, -1);// S
	//if(event.keyCode == 65) onSpeedKey1(1, -1);// A
	//if(event.keyCode == 68) onSpeedKey1(-1, 1);// D
	
};
function onSpeedKey0(ddx, ddy)
{
	cameraFPS.vx += ddx*0.45*cameraFPS.dir.e[0];
	cameraFPS.vz += ddy*0.45*cameraFPS.dir.e[2];
}
function onSpeedKey1(ddx, ddy)
{
	var vvx = Math.cos(ddx*Math.PI*0.1)*cameraFPS.dir.e[0]
		- Math.sin(ddx*Math.PI*0.1)*cameraFPS.dir.e[2];
	
	var vvy = Math.sin(ddx*Math.PI*0.1)*cameraFPS.dir.e[0]
		+ Math.cos(ddx*Math.PI*0.1)*cameraFPS.dir.e[2];
		
	cameraFPS.vx += vvx;
	cameraFPS.vz += vvy;
	cameraFPS.vYaw += ddy*0.003;
	
}

function onTouchStart(event)
{
	// Prevent the browser from doing its default thing (scroll, zoom)
	event.preventDefault();


	if(event.clientX) // on mouse down
	{
		mouse.x = mouse.x0 = event.clientX;
		mouse.y = mouse.y0 = event.clientY;
		infoPad.add("mouse.x", mouse.x0);
		infoPad.add("mouse.y", mouse.y0);
		
		mouse.down = true;
	}
	
	if(!event.touches) return;
	// on touch star
	for(var i = 0; i < event.touches.length; i++)
	{
		var mx = event.touches[i].clientX;
		var my = event.touches[i].clientY;
		
	}

}

function onTouchMove(event)
{
	event.preventDefault();

	if(event.clientX && mouse.down) // on mouse move
	{
		mouse.dx = event.clientX - mouse.x0;
		mouse.dy = event.clientY - mouse.y0;
		mouse.x = event.clientX;
		mouse.y = event.clientY;
		
		infoPad.add("mouse.dx", mouse.dx);
		infoPad.add("mouse.dy", mouse.dy);

	}
	
	if(!event.touches) return;
	
	for(var i = 0; i < event.touches.length; i++)
	{

	}
}

function onTouchEnd(event)
{
	event.preventDefault();

	if(event.clientX) // on mouse up
	{
		mouse.down = false;
		mouse.dx = 0;
		mouse.dy = 0;
	}
	if(!event.touches) return;
	
	for(var i = 0; i < event.touches.length; i++)
	{
	
	}
	
}



var bTimeout = false;
window.onresize = function()
{
	canvasResize();
	bTimeout = true;
	cameraFPS.setProj(70, gl.viewportWidth, gl.viewportHeight, 0.1, 5000);
	
}

var first = true;
var lastOrien;
window.ondeviceorientation =  function(e) 
{	
	if(first)
	{
		lastOrien = window.orientation;
		first = false;
	}
	if(window.orientation !== lastOrien)
	{
		window.onresize();
		lastOrien = window.orientation;
	}

	//infoPad.add("alpa: ", e.alpha);
	//infoPad.add("beta: ",e.beta);
	//infoPad.add("gamma: ",e.gamma);
	//infoPad.add("orientation: ",window.orientation);
}

window.onblur = function()
{
	bTimeout = true;
}

// ----------------------------------------------------------------------------
// game

function gameloop() 
{
	window.requestAnimFrame( gameloop );
	if(bTimeout)
	{
		timer.lasttime = Date.now();
		bTimeout = false;
	}
	timer.dtime = Date.now() - timer.lasttime;
	timer.time = Date.now() - timer.startime;
	drawScene();
	timer.lasttime = Date.now();
}


function game()
{
	init();
	gameloop();
}

// ----------------------------------------------------------------------------



