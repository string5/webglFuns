//========================================================================//
//      Copyright 2011, Smilodon Studio Inc.
//      All rights reserved.
//========================================================================//

/**
 *	poly
 *	@author: CYS
 */
var poly = function()
{
	this.posBuffer = null;
	this.tcBuffer  = null;
	this.indexBuffer = null;
	this.texDiffuse = null;
	this.effPoly = null;
	this.x = 0;
	this.y = 0;
	this.z = 0;
		
	this.init();
};


poly.prototype.initBuffers = function()
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



poly.prototype.initTexture = function()
{
	var tex = gl.createTexture();

	var woodImage = new Image();
	woodImage.onload = function ()
	{
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, woodImage);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.generateMipmap(gl.TEXTURE_2D);

		gl.bindTexture(gl.TEXTURE_2D, null);
	}
	woodImage.src = "./res/wood.gif";
	this.texDiffuse = tex;
}



poly.prototype.initShader = function()
{
	this.effPoly = new program();
	this.effPoly.loadFromID("vsIcePoly");
	this.effPoly.loadFromID("psIcePoly");
	this.effPoly.link();

	this.effPoly.pos = gl.getAttribLocation(this.effPoly.program, "aPos");
	this.effPoly.tc = gl.getAttribLocation(this.effPoly.program, "aTc");
	
	this.effPoly.time = gl.getUniformLocation( this.effPoly.program, 'time' );
	this.effPoly.resolution = gl.getUniformLocation( this.effPoly.program, 'resolution' );
	this.effPoly.mouse = gl.getUniformLocation( this.effPoly.program, 'mouse' );
	this.effPoly.matMVP = gl.getUniformLocation( this.effPoly.program, 'matMVP' );
	this.effPoly.sampler = gl.getUniformLocation(this.effPoly.program, 'Sampler');

}



poly.prototype.init = function()
{
	this.initBuffers();
	this.initTexture();
	this.initShader();
}

poly.prototype.set = function()
{
	this.effPoly.apply();

	gl.uniform1f( this.effPoly.time, timer.time/1000 );
	gl.uniform2f( this.effPoly.resolution, canvas.width, canvas.height );
	gl.uniform2f( this.effPoly.mouse, mouse.x, mouse.y);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texDiffuse);
	gl.uniform1i(this.effPoly.sampler, 0);

}


poly.prototype.setMVP = function(mvp)
{
	gl.uniformMatrix4fv(this.effPoly.matMVP, false, mvp.e);
}


poly.prototype.draw = function()
{
	gl.enableVertexAttribArray(this.effPoly.pos);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(this.effPoly.pos, this.posBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(this.effPoly.tc);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.tcBuffer);
	gl.vertexAttribPointer(this.effPoly.tc, this.tcBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

}
