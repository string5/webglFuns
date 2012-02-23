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
var mouse = {x: 0, y: 0, down: false};


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
		window.addEventListener('keyup', onKeyUp, false);
	}

	canvas.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	infoPad = new infoPad();
	infoPad.add("Speed game", "@Smilodon Studio");

	initBuffers();
	initShaders();
}


// ----------------------------------------------------------------------------
// scene

var posBuffer;
var tcBuffer;
function initBuffers()
{
	var depth = -1.0;
	var vertices = [  
			-1.0, -1.0, depth,
			 1.0, -1.0, depth,
			-1.0,  1.0, depth,
			 1.0,  1.0, depth, ];

	posBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	posBuffer.itemSize = 3;
	posBuffer.numItems = 4;

	var texCoords = [
			0.0, 0.0,
			1.0, 0.0,
			0.0, 1.0,
			1.0, 1.0, ];

	tcBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tcBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
	tcBuffer.itemSize = 2;
	tcBuffer.numItems = 4;

}


var effFlower;
function initShaders()
{
	effFlower = new program();
	effFlower.loadFromID("shader-fs");
	effFlower.loadFromID("shader-vs");
	effFlower.bind();

	effFlower.pos = gl.getAttribLocation(effFlower.program, "aPos");
	gl.enableVertexAttribArray(effFlower.pos);

	effFlower.tc = gl.getAttribLocation(effFlower.program, "aTc");
	gl.enableVertexAttribArray(effFlower.tc);

	effFlower.time = gl.getUniformLocation( effFlower.program, 'time' );
	effFlower.resolution = gl.getUniformLocation( effFlower.program, 'resolution' );
	effFlower.mouse = gl.getUniformLocation( effFlower.program, 'mouse' );
	effFlower.matMVP = gl.getUniformLocation( effFlower.program, 'matMVP' );
}

function drawScene()
{
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clearColor(0.0, 0.76, 0.9, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	var axis = new vec3(0, 0, 1);
	var matR = mat4.makeRotate(timer.time*0.001, axis);
	var matMVP = mat4.makePerspective(120, gl.viewportWidth/gl.viewportHeight, 1, 5000);
	matMVP.x(matR);
	gl.uniform1f( effFlower.time, timer.time/1000 );
	gl.uniform2f( effFlower.resolution, canvas.width, canvas.height );
	gl.uniform2f( effFlower.mouse, mouse.x, mouse.y);
	gl.uniformMatrix4fv(effFlower.matMVP, false, matMVP.elements);

	gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
	gl.vertexAttribPointer(effFlower.pos, posBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, tcBuffer);
	gl.vertexAttribPointer(effFlower.tc, tcBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, posBuffer.numItems);

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


function onTouchStart(event)
{
	// Prevent the browser from doing its default thing (scroll, zoom)
	event.preventDefault();


	if(event.clientX) // on mouse down
	{
		mouse.x = event.clientX;
		mouse.y = event.clientY;
		
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



