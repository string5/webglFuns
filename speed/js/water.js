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
	this.texSuf = image.load2D("./res/Waterbump.jpg", [0, 200, 250, 255]);
	this.initBuffers();
	this.initShader();
};


water.prototype.initBuffers = function()
{
	var size = 10000;
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

	this.effect.camPos  = gl.getUniformLocation(this.effect.program, 'camPos' );
	this.effect.matMVP  = gl.getUniformLocation(this.effect.program, 'matMVP' );
	this.effect.samplerCube = gl.getUniformLocation(this.effect.program, 'samplerR');
	this.effect.samplerSuf = gl.getUniformLocation(this.effect.program, 'samplerSuf');

}



water.prototype.draw = function(matMVP)
{	
	this.effect.apply();

	gl.uniformMatrix4fv(this.effect.matMVP, false, matMVP.e);
	gl.uniform3f(this.effect.camPos, cameraFPS.pos.e[0],
			cameraFPS.pos.e[1], cameraFPS.pos.e[2]);

	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texCube);
	gl.uniform1i(this.effect.samplerCube, 1);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texSuf);
	gl.uniform1i(this.effect.samplerSuf, 0);

	gl.enableVertexAttribArray(this.effect.pos);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(this.effect.pos, this.posBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.posBuffer.numItems);

}
