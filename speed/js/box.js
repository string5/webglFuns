//========================================================================//
//      Copyright 2011, Smilodon Studio Inc.
//      All rights reserved.
//========================================================================//

/**
 *	box
 *	@author: CYS
 */
var box = function()
{
	this.posBuffer = null;
	this.tcBuffer  = null;
	this.indexBuffer = null;
	this.effCube = null;
};


box.prototype.initBuffers = function()
{
	var vertices = 
		[  
			// Front face
			-1.0, -1.0,  1.0,
			1.0, -1.0,  1.0,
			1.0,  1.0,  1.0,
			-1.0,  1.0,  1.0,

			// Back face
			-1.0, -1.0, -1.0,
			-1.0,  1.0, -1.0,
			1.0,  1.0, -1.0,
			1.0, -1.0, -1.0,

			// Top face
			-1.0,  1.0, -1.0,
			-1.0,  1.0,  1.0,
			1.0,  1.0,  1.0,
			1.0,  1.0, -1.0,

			// Bottom face
			-1.0, -1.0, -1.0,
			1.0, -1.0, -1.0,
			1.0, -1.0,  1.0,
			-1.0, -1.0,  1.0,

			// Right face
			1.0, -1.0, -1.0,
			1.0,  1.0, -1.0,
			1.0,  1.0,  1.0,
			1.0, -1.0,  1.0,

			// Left face
			-1.0, -1.0, -1.0,
			-1.0, -1.0,  1.0,
			-1.0,  1.0,  1.0,
			-1.0,  1.0, -1.0, 
		];

	this.posBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.posBuffer.itemSize = 3;
	this.posBuffer.numItems = 24;

	var texCoords = 
		[
			// Front face
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0,

			// Back face
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0,
			0.0, 0.0,

			// Top face
			0.0, 1.0,
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,

			// Bottom face
			1.0, 1.0,
			0.0, 1.0,
			0.0, 0.0,
			1.0, 0.0,

			// Right face
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0,
			0.0, 0.0,

			// Left face
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0,
		];

	this.tcBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.tcBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
	this.tcBuffer.itemSize = 2;
	this.tcBuffer.numItems = 24;

	var cubeIndices = 
		[
			0, 1, 2,      0, 2, 3,    // Front face
			4, 5, 6,      4, 6, 7,    // Back face
			8, 9, 10,     8, 10, 11,  // Top face
			12, 13, 14,   12, 14, 15, // Bottom face
			16, 17, 18,   16, 18, 19, // Right face
			20, 21, 22,   20, 22, 23  // Left face
		];

	this.indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);
	this.indexBuffer.itemSize = 1;
	this.indexBuffer.numItems = 36;

}


box.prototype.initShader = function()
{
	this.effCube = new program();
	this.effCube.loadFromID("vsCube");
	this.effCube.loadFromID("psCube");
	this.effCube.bind();

	this.effCube.pos = gl.getAttribLocation(this.effCube.program, "aPos");
	gl.enableVertexAttribArray(this.effCube.pos);

	this.effCube.tc = gl.getAttribLocation(this.effCube.program, "aTc");
	gl.enableVertexAttribArray(this.effCube.tc);

	this.effCube.time = gl.getUniformLocation( this.effCube.program, 'time' );
	this.effCube.resolution = gl.getUniformLocation( this.effCube.program, 'resolution' );
	this.effCube.mouse = gl.getUniformLocation( this.effCube.program, 'mouse' );
	this.effCube.matMVP = gl.getUniformLocation( this.effCube.program, 'matMVP' );
}


box.prototype.init = function()
{
	this.initBuffers();
	this.initShader();
}

box.prototype.set = function()
{
	gl.uniform1f( this.effCube.time, timer.time/1000 );
	gl.uniform2f( this.effCube.resolution, canvas.width, canvas.height );
	gl.uniform2f( this.effCube.mouse, mouse.x, mouse.y);
}


box.prototype.setMVP = function(mvp)
{
	gl.uniformMatrix4fv(this.effCube.matMVP, false, mvp.elements);
}


box.prototype.draw = function()
{
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(this.effCube.pos, this.posBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.tcBuffer);
	gl.vertexAttribPointer(this.effCube.tc, this.tcBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

}
