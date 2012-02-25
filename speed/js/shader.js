//========================================================================//
//      Copyright 2011, Smilodon Studio Inc.
//      All rights reserved.
//========================================================================//

/**
 *	GLSL program
 *	@author: CYS
 */

var program = function()
{
	this.program = null;
	this.vs = null;
	this.ps = null;
	this.lastError = "";
}


program.prototype.load = function(type, shaderSrc)
{
	var shader = gl.createShader(type);
	if (shader == null)return null;

	// Load the shader source
	gl.shaderSource(shader, shaderSrc);
	// Compile the shader
	gl.compileShader(shader);

	// Check the compile status
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		var infoLog = gl.getShaderInfoLog(shader);
		this.lastError = infoLog; 
		window.console.error("Error compiling shader:\n" + infoLog);
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}


program.prototype.loadFromID = function(id)
{
	var shaderScript = document.getElementById(id);
	
	if (shaderScript.type == "shader/vertex")
		this.vs = this.load(gl.VERTEX_SHADER, shaderScript.text)

	if (shaderScript.type == "shader/fragment")
		this.ps = this.load(gl.FRAGMENT_SHADER, shaderScript.text)
	
}

program.prototype.link = function()
{
	this.program = gl.createProgram();
	gl.attachShader(this.program, this.vs);
	gl.attachShader(this.program, this.ps);
	gl.linkProgram(this.program);

	if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
	{
		console.error("Could not initialise shaders");
	}

}

program.prototype.apply = function()
{
	gl.useProgram(this.program);
}

