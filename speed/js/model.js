//========================================================================//
//      Copyright 2011, Smilodon Studio Inc.
//      All rights reserved.
//========================================================================//

/**
 *	model
 *	@author: CYS
 */
var model = function( file )
{
	this.posBuffer = null;
	this.tcBuffer  = null;
	this.indexBuffer = null;
	this.texDiffuse = null;
	this.effCube = null;

	this.initBuffers(file);
	this.initTexture();
	this.initShader();

};


model.prototype.initBuffers = function(file)
{
	var posBuffer = this.posBuffer = gl.createBuffer();
	var tcBuffer = this.tcBuffer = gl.createBuffer();
	var indexBuffer = this.indexBuffer = gl.createBuffer();

	var request = new XMLHttpRequest();
	request.open("GET", file);
	request.onreadystatechange = function ()
	{
		if (request.readyState == 4)
		{
			var data = JSON.parse(request.responseText);

			
			gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.pos), gl.STATIC_DRAW);
			posBuffer.itemSize = 3;
			posBuffer.numItems = data.pos.length/3;

			
			gl.bindBuffer(gl.ARRAY_BUFFER, tcBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.texcoord), gl.STATIC_DRAW);
			tcBuffer.itemSize = 2;
			tcBuffer.numItems = data.pos.texcoord/2;

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW);
			indexBuffer.itemSize = 1;
			indexBuffer.numItems = data.indices.length;

		}
	}
	request.send();

}



model.prototype.initTexture = function()
{
	var tex = this.texDiffuse = gl.createTexture();
	
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
}



model.prototype.initShader = function()
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
	this.effCube.sampler = gl.getUniformLocation(this.effCube.program, 'Sampler');

}



model.prototype.set = function()
{
	gl.uniform1f( this.effCube.time, timer.time/1000 );
	gl.uniform2f( this.effCube.resolution, canvas.width, canvas.height );
	gl.uniform2f( this.effCube.mouse, mouse.x, mouse.y);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texDiffuse);
	gl.uniform1i(this.effCube.sampler, 0);

}


model.prototype.setMVP = function(mvp)
{
	gl.uniformMatrix4fv(this.effCube.matMVP, false, mvp.elements);
}


model.prototype.draw = function()
{
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(this.effCube.pos, this.posBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.tcBuffer);
	gl.vertexAttribPointer(this.effCube.tc, this.tcBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

}
