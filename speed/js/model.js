//========================================================================//
//      Copyright 2011, Smilodon Studio Inc.
//      All rights reserved.
//========================================================================//

/**
 *	model
 *	@author: CYS
 */
var model = function( mfile, texfile )
{
	this.pos = new vec3();
	this.dir = new vec3(0,0,-1);
	this.v = new vec3();
	this.a = new vec3();
	this.pitch = 0;
	this.oldPitch = 0;
	
	this.posBuffer = null;
	this.norBuffer = null;
	this.tcBuffer  = null;
	this.indexBuffer = null;
	this.effect = null;

	this.initBuffers(mfile);
	this.initShader();
	this.texDiffuse = image.load2D(texfile, [0, 200, 250, 255]);


};

model.prototype.update = function()
{
	this.v.add(this.a);
	if(this.v.length() > maxSpeed) this.v.normalize()*maxSpeed;
	this.pos.add(this.v);
}

model.prototype.initBuffers = function(file)
{
	var posBuffer = this.posBuffer = gl.createBuffer();
	var norBuffer = this.norBuffer = gl.createBuffer();
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

			gl.bindBuffer(gl.ARRAY_BUFFER, norBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.nor), gl.STATIC_DRAW);
			posBuffer.itemSize = 3;
			posBuffer.numItems = data.nor.length/3;

			gl.bindBuffer(gl.ARRAY_BUFFER, tcBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.texcoord), gl.STATIC_DRAW);
			tcBuffer.itemSize = 2;
			tcBuffer.numItems = data.texcoord.length/2;

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW);
			indexBuffer.itemSize = 1;
			indexBuffer.numItems = data.indices.length;

		}
	}
	request.send();

}


model.prototype.initShader = function()
{
	this.effect = new program();
	this.effect.loadFromID("vsCube");
	this.effect.loadFromID("psCube");
	this.effect.link();

	this.effect.apply();
	this.effect.pos = gl.getAttribLocation(this.effect.program, "aPos");
	this.effect.nor = gl.getAttribLocation(this.effect.program, "aNor");
	this.effect.tc = gl.getAttribLocation(this.effect.program, "aTc");

	this.effect.time = gl.getUniformLocation( this.effect.program, 'time' );
	this.effect.resolution = gl.getUniformLocation( this.effect.program, 'resolution' );
	this.effect.mouse = gl.getUniformLocation( this.effect.program, 'mouse' );
	this.effect.matMVP = gl.getUniformLocation( this.effect.program, 'matMVP' );
	this.effect.sampler = gl.getUniformLocation(this.effect.program, 'sampler');

}



model.prototype.set = function()
{
	this.effect.apply();

	gl.uniform1f( this.effect.time, timer.time/1000 );
	gl.uniform2f( this.effect.resolution, canvas.width, canvas.height );
	gl.uniform2f( this.effect.mouse, mouse.x, mouse.y);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texDiffuse);
	gl.uniform1i(this.effect.sampler, 0);

}


model.prototype.setMVP = function(mvp)
{
	gl.uniformMatrix4fv(this.effect.matMVP, false, mvp.e);
}


model.prototype.draw = function()
{
	gl.enableVertexAttribArray(this.effect.pos);
	gl.enableVertexAttribArray(this.effect.nor);
	gl.enableVertexAttribArray(this.effect.tc);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(this.effect.pos, this.posBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.norBuffer);
	gl.vertexAttribPointer(this.effect.nor, this.norBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.tcBuffer);
	gl.vertexAttribPointer(this.effect.tc, this.tcBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

}
