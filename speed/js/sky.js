//========================================================================//
//      Copyright 2011, Smilodon Studio Inc.
//      All rights reserved.
//========================================================================//

/**
 *	sky
 *	@author: CYS
 */
var sky = function(cubeFile)
{
	this.posBuffer = null;
	this.effect = null;
	this.texCube = image.loadCube(cubeFile, [0, 200, 250, 255]);
	this.initBuffers();
	this.initShader();
};


sky.prototype.initBuffers = function()
{
	var vertices = 
		[  -1.0, -1.0, 1.0,
		    1.0, -1.0, 1.0,
		   -1.0,  1.0, 1.0,
		    1.0,  1.0, 1.0 ];

	this.posBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.posBuffer.itemSize = 3;
	this.posBuffer.numItems = 4;


}



sky.prototype.initShader = function()
{
	this.effect = new program();
	this.effect.loadFromID("vsSkybox");
	this.effect.loadFromID("psSkybox");
	this.effect.link();

	this.effect.pos = gl.getAttribLocation(this.effect.program, "aPos");

	this.effect.matIVP  = gl.getUniformLocation(this.effect.program, 'matIVP' );
	this.effect.sampler = gl.getUniformLocation(this.effect.program, 'sampler');

}



sky.prototype.draw = function(matIVP)
{	
	this.effect.apply();

	gl.uniformMatrix4fv(this.effect.matIVP, false, matIVP.e);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texCube);
	gl.uniform1i(this.effect.sampler, 0);

	gl.enableVertexAttribArray(this.effect.pos);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(this.effect.pos, this.posBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.posBuffer.numItems);

}
