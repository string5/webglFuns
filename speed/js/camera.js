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
	this.dir = new vec3(0, 0, -1);
	this.up  = new vec3(0, 1, 0);
	this.right = new vec3(1, 0, 0);
	
	this.pitch = 0;
	this.yaw = 0;
	this.vPitch = 0;
	this.vYaw = 0;

	this.vx = 0;
	this.vz = 0;
	
	this.matProj  = mat4.makePerspective(this.fov, this.width/this.height, this.nearPlane, this.farPlane );
	this.matView  = mat4.I();
	this.matSkyView  = mat4.I();
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
        this.pos.setElements(pos);

	this.dir = dir.normalize();
	this.dir.e[2] = - this.dir.e[2];
	this.up = new vec3(0, 1, 0);
	this.right = cross(this.up, this.dir);
	this.up = cross(this.dir, this.right);
	
	var v = this.matView.e;
	v[0] = this.right.e[0];
	v[1] = this.right.e[1];
	v[2] = this.right.e[2];
	v[3] = 0;
	v[4] = this.up.e[0];
	v[5] = this.up.e[1];
	v[6] = this.up.e[2];
	v[7] = 0;
	v[8] = this.dir.e[0];
	v[9] = this.dir.e[1];
	v[10] = this.dir.e[2];
	v[11] = 0;
	v[12] = 0;
	v[13] = 0;
	v[14] = 0;
	v[15] = 1;
	
	this.matSkyView.setElements(this.matView.e);
	this.matView.translate(pos.negative());

	this._update();
	
	this.matVP = matMul(this.matProj, this.matView);


}

camera.prototype.setView2 = function(pos, pitch, yaw)
{
       this.pos = pos;
        this.pitch = pitch;
        this.yaw = yaw;

        this.matView = mat4.rotateXY(pitch, yaw);
	this.matSkyView.setElements(this.matView.e);
        var skypos = new vec3(pos.e[0]*0.02, 0, pos.e[2]*0.02);
	this.matSkyView.translate(skypos.negative());
        
	this.matView.translate(pos.negative());
        pos.negative();
	this.matVP = matMul(this.matProj, this.matView);
	
	this._update();
}

camera.prototype._update = function() 
{
	var v = this.matView.e;
	this.right.e[0] = v[0];
	this.right.e[1] = v[1];
	this.right.e[2] = v[2];
	this.up.e[0] = v[4];
	this.up.e[1] = v[5];
	this.up.e[2] = v[6];
	this.dir.e[0] = v[8];
	this.dir.e[1] = v[9];
	this.dir.e[2] = -v[10];
}


camera.prototype.onSpeed = function(vSpeed)
{
//	this.pos.add(vSpeed);
	if(vSpeed.length() < 0.1) vSpeed = this.dir;
	this.setView(this.pos, vSpeed);
}
