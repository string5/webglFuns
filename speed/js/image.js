//========================================================================//
//      Copyright 2011, Smilodon Studio Inc.
//      All rights reserved.
//========================================================================//

/**
 *	webgl image loader
 *	@author: CYS
 */
var image = function()
{

};

image.load2D = function(file, initialColor)
{
	var tex = gl.createTexture();
	
	var img = new Image();
	gl.bindTexture(gl.TEXTURE_2D, tex);
	var pixel = new Uint8Array(initialColor);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA,  gl.UNSIGNED_BYTE,pixel);
	gl.bindTexture(gl.TEXTURE_2D, null);

	img.onload = function ()
	{
		gl.bindTexture(gl.TEXTURE_2D, tex);
		//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);

	}
	img.src = file;

	return tex;
}

image.loadCube = function(files, initialColor)
{
	var cubeTexture = gl.createTexture();

	gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTexture);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

	for (var i = 0; i < 6; ++i) image.LoadCubeId(i, cubeTexture, files, initialColor);

	return cubeTexture;
}


image.LoadCubeId = function(index, cubeTexture, files, initialColor)
{
	var cubeImage = new Image();
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTexture);
	var pixel = new Uint8Array(initialColor);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + index, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

	cubeImage.onload = function ()
	{
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTexture);
		gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + index, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cubeImage);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
	}
	cubeImage.src = files[index];
}
