//========================================================================//
//      Copyright 2011, Smilodon Studio Inc.
//      All rights reserved.
//========================================================================//

/**
 *	webGL buffer
 *	@author: CYS
 */
var buffer = function(array, opt_target)
{
	this.target = opt_target || gl.ARRAY_BUFFER;
	this.buf = gl.createBuffer();
	this.set(array);

	this.numComponents_ = array.numComponents;
	this.numElements_ = array.numElements;
	this.totalComponents_ = this.numComponents_ * this.numElements_;

	if (array.buffer instanceof Float32Array)
	{
		this.type_ = gl.FLOAT;
		this.normalize_ = false;
	}
	else if (array.buffer instanceof Uint8Array)
	{
		this.type_ = gl.UNSIGNED_BYTE;
		this.normalize_ = true;
	}
	else if (array.buffer instanceof Int8Array)
	{
		this.type_ = gl.BYTE;
		this.normalize_ = true;
	}
	else if (array.buffer instanceof Uint16Array)
	{
		this.type_ = gl.UNSIGNED_SHORT;
		this.normalize_ = true;
	}
	else if (array.buffer instanceof Int16Array)
	{
		this.type_ = gl.SHORT;
		this.normalize_ = true;
	}
	else
	{
		throw("unhandled type:" + (typeof array.buffer));
	}
};

buffer.prototype.set = function(array)
{
	gl.bindBuffer(this.target, this.buf);
	gl.bufferData(this.target, array.buffer, gl.STATIC_DRAW);
}

buffer.prototype.type = function()
{
	return this.type_;
};

buffer.prototype.numComponents = function()
{
	return this.numComponents_;
};

buffer.prototype.numElements = function()
{
	return this.numElements_;
};

buffer.prototype.totalComponents = function()
{
	return this.totalComponents_;
};

buffer.prototype.buffer = function()
{
	return this.buf;
};

buffer.prototype.stride = function()
{
	return 0;
};

buffer.prototype.normalize = function()
{
	return this.normalize_;
}

buffer.prototype.offset = function()
{
	return 0;
};
