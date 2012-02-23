//========================================================================//
//      Copyright 2012, Smilodon Studio Inc.
//      All rights reserved.
//========================================================================//

/**
 *	game 
 *      @author: CYS
 */


var canvas;
var g3D;
var infoPad;

var timer = {time: 0, dtime: 0, startime: Date.now(), lasttime: Date.now() };
var mouse = {x: 0, y: 0, down: false};


// ----------------------------------------------------------------------------
// initlalize

function canvasResize()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	attribs = { antialias:true};
	if(!g3D) g3D = initWebGL(canvas,attribs);
	g3D.viewportWidth = canvas.width;
	g3D.viewportHeight = canvas.height;
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

	initBuffers();
	initShaders();
}


// ----------------------------------------------------------------------------
// scene

var posBuffer;
function initBuffers()
{
	posBuffer = g3D.createBuffer();
	g3D.bindBuffer(g3D.ARRAY_BUFFER, posBuffer);
	var vertices = [  -1.0, -1.0, 0.0,
			   1.0, -1.0, 0.0,
			  -1.0,  1.0, 0.0,
			   1.0,  1.0, 0.0 ];

	g3D.bufferData(g3D.ARRAY_BUFFER, new Float32Array(vertices), g3D.STATIC_DRAW);
	posBuffer.itemSize = 3;
	posBuffer.numItems = 4;
}


var testProgram;
function initShaders()
{
	testProgram = new program(g3D);
	testProgram.loadFromID("shader-fs");
	testProgram.loadFromID("shader-vs");
	testProgram.bind();
}

function drawScene()
{
	g3D.viewport(0, 0, g3D.viewportWidth, g3D.viewportHeight);
	g3D.clearColor(0.0, 0.76, 0.9, 1.0);
	g3D.clear(g3D.COLOR_BUFFER_BIT | g3D.DEPTH_BUFFER_BIT);
	
	g3D.uniform1f( g3D.getUniformLocation( testProgram.program, 'time' ), timer.time/1000 );
	g3D.uniform2f( g3D.getUniformLocation( testProgram.program, 'resolution' ), canvas.width, canvas.height );
	g3D.uniform2f( g3D.getUniformLocation( testProgram.program, 'mouse' ), mouse.x, mouse.y);
	g3D.bindBuffer(g3D.ARRAY_BUFFER, posBuffer);
	g3D.vertexAttribPointer(testProgram.program.vertexPositionAttribute, posBuffer.itemSize, g3D.FLOAT, false, 0, 0);
	g3D.drawArrays(g3D.TRIANGLE_STRIP, 0, posBuffer.numItems);

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




