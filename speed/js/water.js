//========================================================================//
//      Copyright 2011, Smilodon Studio Inc.
//      All rights reserved.
//========================================================================//

/**
 *	water
 *	@author: CYS
 */
var water = function(cubeFile)
{
	this.posBuffer = null;
	this.effect = null;
	this.texCube = image.loadCube(cubeFile, [0, 200, 250, 255]);
	this.initBuffers();
	this.initShader();
};


water.prototype.initBuffers = function()
{
	var size = 100;
	var vertices = 
		[  -size,  0.0,-size,
		    size,  0.0,-size,
		   -size,  0.0, size,
		    size,  0.0, size ];

	this.posBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.posBuffer.itemSize = 3;
	this.posBuffer.numItems = 4;


}



water.prototype.initShader = function()
{
	this.effect = new program();
	this.effect.loadFromID("vsIce");
	this.effect.loadFromID("psIce");
	this.effect.link();

	this.effect.pos = gl.getAttribLocation(this.effect.program, "aPos");

	this.effect.matMVP  = gl.getUniformLocation(this.effect.program, 'matMVP' );
	this.effect.sampler = gl.getUniformLocation(this.effect.program, 'sampler');

}



water.prototype.draw = function(matMVP)
{	
	this.effect.apply();

	gl.uniformMatrix4fv(this.effect.matMVP, false, matMVP.elements);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texCube);
	gl.uniform1i(this.effect.sampler, 0);

	gl.enableVertexAttribArray(this.effect.pos);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(this.effect.pos, this.posBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.posBuffer.numItems);

}
