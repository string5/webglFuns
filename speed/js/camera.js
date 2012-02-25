//========================================================================//
//      Copyright 2011, Smilodon Studio Inc.
//      All rights reserved.
//========================================================================//

/**
 *	camera
 *	@author: CYS
 */
var camera = function()
{
	this.width  = 256;
	this.height = 256;
	this.fov = 60.0;
	this.nearPlane = 1.0;
	this.farPlane  = 5000.0;

	this.pos = new vec3(0, 0, 0);
	this.dir = new vec3(0, 0, 1);
	this.up  = new vec3(0, 1, 0);
	this.right = new vec3(1, 0, 0);

	this.matProj  = mat4.makePerspective(this.fov, this.width/this.height, this.nearPlane, this.farPlane );
	this.matView  = mat4.I();
	this.matVP = matMul(this.matProj, this.matView);
};

camera.prototype.setProj = function(fov, w, h, n, f)
{
	this.fov = fov;
	this.width = w;
	this.height = h;
	this.nearPlane = n;
	this.farPlane = f;

	this.matProj  = mat4.makePerspective(fov, w/h, n, f);
	this.matVP = matMul(this.matProj, this.matView);

}


camera.prototype.setView = function(pos, dir)
{
	this.dir = dir.normalize();
	this.dir.elements[2] = - this.dir.elements[2];
	this.up = new vec3(0, 1, 0);
	this.right = cross(this.up, this.dir);
	this.up = cross(this.dir, this.right);
	
	var v = this.matView.elements;
	v[0] = this.right.elements[0];
	v[1] = this.right.elements[1];
	v[2] = this.right.elements[2];
	v[3] = 0;
	v[4] = this.up.elements[0];
	v[5] = this.up.elements[1];
	v[6] = this.up.elements[2];
	v[7] = 0;
	v[8] = this.dir.elements[0];
	v[9] = this.dir.elements[1];
	v[10] = this.dir.elements[2];
	v[11] = 0;
	v[12] = 0;
	v[13] = 0;
	v[14] = 0;
	v[15] = 1;

	this.matView.translate(pos.negative());

	this.right.elements[0] = v[0];
	this.right.elements[1] = v[1];
	this.right.elements[2] = v[2];
	this.up.elements[0] = v[4];
	this.up.elements[1] = v[5];
	this.up.elements[2] = v[6];
	this.dir.elements[0] = v[8];
	this.dir.elements[1] = v[9];
	this.dir.elements[2] = v[10];

	this.matVP = matMul(this.matProj, this.matView);

}

camera.prototype.setView2= function(fov, w, h, n, f)
{

}
