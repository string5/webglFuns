//========================================================================//
//      Copyright 2011, Smilodon Studio Inc.
//      All rights reserved.
//========================================================================//

/**
 *	fast javascript math
 *      from EWGL_math.js and glMatrix.js
 *      to do: compare to tdl fast.js
 *	@author: CYS
 */

// Fallback for systems that don't support WebGL
if (typeof Float32Array != 'undefined')
{
	glMatrixArrayType = Float32Array;
}
else if (typeof WebGLFloatArray != 'undefined')
{
	glMatrixArrayType = WebGLFloatArray; // This is officially deprecated and should dissapear in future revisions.
}
else
{
	glMatrixArrayType = Array;
}


var identitymat4 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

var mat4 = function (els)
{
	this.elements = new glMatrixArrayType(els || identitymat4);
	return this;
};

mat4.prototype.I = mat4.prototype.identity = function ()
{
	this.elements = identitymat4;
	return this;
};


mat4.prototype.e = function (i, j)
{
	return this.elements[((i - 1) * 4) + (j - 1)];
};

mat4.prototype.row = function (i)
{
	var e = this.elements;
	return [e[i - 1], e[3 + i], e[7 + i], e[11 + i]];
};

mat4.prototype.col = function (i)
{
	var e = this.elements;
	return [e[i * 4 - 4], e[i * 4 - 3], e[i * 4 - 2], e[i * 4 - 1]];
};

mat4.prototype.dimensions = function ()
{
	return { 'rows': 4, 'cols': 4 };
};

mat4.prototype.rows = function ()
{
	return 4;
};

mat4.prototype.cols = function ()
{
	return 4;
};

var precision = 1e-6;
mat4.prototype.eql = function (mat4)
{
	var i = 16, e1 = this.elements, e2 = mat4.elements;

	return Math.abs(e1[0] - e2[0]) < precision &&
	       Math.abs(e1[1] - e2[1]) < precision &&
	       Math.abs(e1[2] - e2[2]) < precision &&
	       Math.abs(e1[3] - e2[3]) < precision &&
	       Math.abs(e1[4] - e2[4]) < precision &&
	       Math.abs(e1[5] - e2[5]) < precision &&
	       Math.abs(e1[6] - e2[6]) < precision &&
	       Math.abs(e1[7] - e2[7]) < precision &&
	       Math.abs(e1[8] - e2[8]) < precision &&
	       Math.abs(e1[9] - e2[9]) < precision &&
	       Math.abs(e1[10] - e2[10]) < precision &&
	       Math.abs(e1[11] - e2[11]) < precision &&
	       Math.abs(e1[12] - e2[12]) < precision &&
	       Math.abs(e1[13] - e2[13]) < precision &&
	       Math.abs(e1[14] - e2[14]) < precision &&
	       Math.abs(e1[15] - e2[15]) < precision;
};

mat4.prototype.setElements = function (els)
{
	var e = this.elements;

	e[0] = els[0];
	e[1] = els[1];
	e[2] = els[2];
	e[3] = els[3];

	e[4] = els[4];
	e[5] = els[5];
	e[6] = els[6];
	e[7] = els[7];

	e[8] = els[8];
	e[9] = els[9];
	e[10] = els[10];
	e[11] = els[11];

	e[12] = els[12];
	e[13] = els[13];
	e[14] = els[14];
	e[15] = els[15];

	return this;
};

mat4.prototype.dup = function ()
{
	return (new mat4(this.elements));
};

mat4.prototype.map = function (fn)
{
	var e = this.elements;

	e[0] = fn(e[0], 0, 0);
	e[1] = fn(e[1], 0, 1);
	e[2] = fn(e[2], 0, 2);
	e[3] = fn(e[3], 0, 3);

	e[4] = fn(e[4], 1, 0);
	e[5] = fn(e[5], 1, 1);
	e[6] = fn(e[6], 1, 2);
	e[7] = fn(e[7], 1, 3);

	e[8] = fn(e[8], 2, 0);
	e[9] = fn(e[9], 2, 1);
	e[10] = fn(e[10], 2, 2);
	e[11] = fn(e[11], 2, 3);

	e[12] = fn(e[12], 3, 0);
	e[13] = fn(e[13], 3, 1);
	e[14] = fn(e[14], 3, 2);
	e[15] = fn(e[15], 3, 3);

	return this;
}

mat4.prototype.add = function (mat4)
{

	var els1 = this.elements, els2 = mat4.elements;

	els1[0] = els1[0] + els2[0];
	els1[1] = els1[1] + els2[1];
	els1[2] = els1[2] + els2[2];
	els1[3] = els1[3] + els2[3];
	els1[4] = els1[4] + els2[4];
	els1[5] = els1[5] + els2[5];
	els1[6] = els1[6] + els2[6];
	els1[7] = els1[7] + els2[7];
	els1[8] = els1[8] + els2[8];
	els1[9] = els1[9] + els2[9];
	els1[10] = els1[10] + els2[10];
	els1[11] = els1[11] + els2[11];
	els1[12] = els1[12] + els2[12];
	els1[14] = els1[13] + els2[13];
	els1[14] = els1[14] + els2[14];
	els1[15] = els1[15] + els2[15];

	return this;
}

mat4.prototype.sub = function (mat4)
{

	var els1 = this.elements, els2 = mat4.elements;

	els1[0] = els1[0] - els2[0];
	els1[1] = els1[1] - els2[1];
	els1[2] = els1[2] - els2[2];
	els1[3] = els1[3] - els2[3];
	els1[4] = els1[4] - els2[4];
	els1[5] = els1[5] - els2[5];
	els1[6] = els1[6] - els2[6];
	els1[7] = els1[7] - els2[7];
	els1[8] = els1[8] - els2[8];
	els1[9] = els1[9] - els2[9];
	els1[10] = els1[10] - els2[10];
	els1[11] = els1[11] - els2[11];
	els1[12] = els1[12] - els2[12];
	els1[14] = els1[13] - els2[13];
	els1[14] = els1[14] - els2[14];
	els1[15] = els1[15] - els2[15];

	return this;
}

mat4.prototype.mul = mat4.prototype.x = function (mat4)
{
	var m1 = this.elements, m2 = mat4.elements || mat4,
	    m10 = m1[0], m11 = m1[4], m12 = m1[8], m13 = m1[12],
	    m14 = m1[1], m15 = m1[5], m16 = m1[9], m17 = m1[13],
	    m18 = m1[2], m19 = m1[6], m110 = m1[10], m111 = m1[14],
	    m112 = m1[3], m113 = m1[7], m114 = m1[11], m115 = m1[15],

	    m20 = m2[0], m21 = m2[4], m22 = m2[8], m23 = m2[12],
	    m24 = m2[1], m25 = m2[5], m26 = m2[9], m27 = m2[13],
	    m28 = m2[2], m29 = m2[6], m210 = m2[10], m211 = m2[14],
	    m212 = m2[3], m213 = m2[7], m214 = m2[11], m215 = m2[15];



	m1[0] = m10 * m20 + m11 * m24 + m12 * m28 + m13 * m212;
	m1[1] = m14 * m20 + m15 * m24 + m16 * m28 + m17 * m212;
	m1[2] = m18 * m20 + m19 * m24 + m110 * m28 + m111 * m212;
	m1[3] = m112 * m20 + m113 * m24 + m114 * m28 + m115 * m212;

	m1[4] = m10 * m21 + m11 * m25 + m12 * m29 + m13 * m213;
	m1[5] = m14 * m21 + m15 * m25 + m16 * m29 + m17 * m213;
	m1[6] = m18 * m21 + m19 * m25 + m110 * m29 + m111 * m213;
	m1[7] = m112 * m21 + m113 * m25 + m114 * m29 + m115 * m213;

	m1[8] = m10 * m22 + m11 * m26 + m12 * m210 + m13 * m214;
	m1[9] = m14 * m22 + m15 * m26 + m16 * m210 + m17 * m214;
	m1[10] = m18 * m22 + m19 * m26 + m110 * m210 + m111 * m214;
	m1[11] = m112 * m22 + m113 * m26 + m114 * m210 + m115 * m214;

	m1[12] = m10 * m23 + m11 * m27 + m12 * m211 + m13 * m215;
	m1[13] = m14 * m23 + m15 * m27 + m16 * m211 + m17 * m215;
	m1[14] = m18 * m23 + m19 * m27 + m110 * m211 + m111 * m215;
	m1[15] = m112 * m23 + m113 * m27 + m114 * m211 + m115 * m215;

	return this;
};

mat4.prototype.translate = function (vec3)
{
	var m1 = this.elements, v1 = vec3.elements || vec3,
	    m10 = m1[0], m11 = m1[4], m12 = m1[8], m13 = m1[12],
	    m14 = m1[1], m15 = m1[5], m16 = m1[9], m17 = m1[13],
	    m18 = m1[2], m19 = m1[6], m110 = m1[10], m111 = m1[14],
	    m112 = m1[3], m113 = m1[7], m114 = m1[11], m115 = m1[15],

	    m23 = v1[0], m27 = v1[1], m211 = v1[2];



	m1[0] = m10;
	m1[1] = m14;
	m1[2] = m18;
	m1[3] = m112;

	m1[4] = m11;
	m1[5] = m15;
	m1[6] = m19;
	m1[7] = m113;

	m1[8] = m12;
	m1[9] = m16;
	m1[10] = m110;
	m1[11] = m114;

	m1[12] = m10 * m23 + m11 * m27 + m12 * m211 + m13;
	m1[13] = m14 * m23 + m15 * m27 + m16 * m211 + m17;
	m1[14] = m18 * m23 + m19 * m27 + m110 * m211 + m111;
	m1[15] = m112 * m23 + m113 * m27 + m114 * m211 + m115;

	return this;
};

mat4.prototype.rotate = function (theta, vec3)
{
	var v = vec3.elements ? vec3.elements : vec3,
	    m1 = this.elements,
	    v0 = v[0], v1 = v[1], v2 = v[2],
	    mod = Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2),
	    x = v0 / mod, y = v1 / mod, z = v2 / mod,
	    s = Math.sin(theta), c = Math.cos(theta), t = 1 - c,

	    m10 = m1[0], m11 = m1[4], m12 = m1[8], m13 = m1[12],
	    m14 = m1[1], m15 = m1[5], m16 = m1[9], m17 = m1[13],
	    m18 = m1[2], m19 = m1[6], m110 = m1[10], m111 = m1[14],
	    m112 = m1[3], m113 = m1[7], m114 = m1[11], m115 = m1[15],

	    m20 = t * x * x + c, m21 = t * x * y - s * z, m22 = t * x * z + s * y,
	    m24 = t * x * y + s * z, m25 = t * y * y + c, m26 = t * y * z - s * x,
	    m28 = t * x * z - s * y, m29 = t * y * z + s * x, m210 = t * z * z + c;

	m1[0] = m10 * m20 + m11 * m24 + m12 * m28;
	m1[1] = m14 * m20 + m15 * m24 + m16 * m28;
	m1[2] = m18 * m20 + m19 * m24 + m110 * m28;
	m1[3] = m112 * m20 + m113 * m24 + m114 * m28;

	m1[4] = m10 * m21 + m11 * m25 + m12 * m29;
	m1[5] = m14 * m21 + m15 * m25 + m16 * m29;
	m1[6] = m18 * m21 + m19 * m25 + m110 * m29;
	m1[7] = m112 * m21 + m113 * m25 + m114 * m29;

	m1[8] = m10 * m22 + m11 * m26 + m12 * m210;
	m1[9] = m14 * m22 + m15 * m26 + m16 * m210;
	m1[10] = m18 * m22 + m19 * m26 + m110 * m210;
	m1[11] = m112 * m22 + m113 * m26 + m114 * m210;

	m1[12] = m13;
	m1[13] = m17;
	m1[14] = m111;
	m1[15] = m115;

	return this;
}

mat4.prototype.scale = function (vec3)
{
	var s = vec3.elements ? vec3.elements : vec3,
	    m1 = this.elements,

	    m10 = m1[0], m11 = m1[4], m12 = m1[8], m13 = m1[12],
	    m14 = m1[1], m15 = m1[5], m16 = m1[9], m17 = m1[13],
	    m18 = m1[2], m19 = m1[6], m110 = m1[10], m111 = m1[14],
	    m112 = m1[3], m113 = m1[7], m114 = m1[11], m115 = m1[15],

	    m20 = s[0], m25 = s[1], m210 = s[2];

	m1[0] = m10 * m20;
	m1[1] = m14 * m20;
	m1[2] = m18 * m20;
	m1[3] = m112 * m20;

	m1[4] = m11 * m25;
	m1[5] = m15 * m25;
	m1[6] = m19 * m25;
	m1[7] = m113 * m25;

	m1[8] = m12 * m210;
	m1[9] = m16 * m210;
	m1[10] = m110 * m210;
	m1[11] = m114 * m210;

	m1[12] = m13;
	m1[13] = m17;
	m1[14] = m111;
	m1[15] = m115;

	return this;
};


mat4.prototype.transpose = function ()
{
	var e = this.elements,

	k = e[1];
	e[1] = e[4];
	e[4] = k;

	k = e[2];
	e[2] = e[8];
	e[8] = k;

	k = e[3];
	e[3] = e[12];
	e[12] = k;

	k = e[6];
	e[6] = e[9];
	e[9] = k;

	k = e[7];
	e[7] = e[13];
	e[13] = k;

	k = e[11];
	e[11] = e[14];
	e[14] = k;

	return this;
};

mat4.prototype.max = function ()
{
	var e = this.elements;
	var m = e[0];
	
	for(var i = 1; i < 16; i++)
	{
		if (e[i] > m) m = e[i];
	}

	return m;
};

mat4.prototype.min = function ()
{
	var e = this.elements;
	var m = e[0];

	for(var i = 1; i < 16; i++)
	{
		if (e[i] < m) m = e[i];
	}

	return m;
};

mat4.prototype.indexOf = function (value)
{
	e = this.elements;

	if (e[0] == value)
	{
		return new WebGLIntArray([0, 0])
	}

	       if (e[1] == value)
	{
		return new WebGLIntArray([0, 1])
	}

	       if (e[2] == value)
	{
		return new WebGLIntArray([0, 2])
	}

	       if (e[3] == value)
	{
		return new WebGLIntArray([0, 3])
	}

	       if (e[4] == value)
	{
		return new WebGLIntArray([1, 0])
	}

	       if (e[5] == value)
	{
		return new WebGLIntArray([1, 1])
	}

	       if (e[6] == value)
	{
		return new WebGLIntArray([1, 2])
	}

	       if (e[7] == value)
	{
		return new WebGLIntArray([1, 3])
	}

	       if (e[8] == value)
	{
		return new WebGLIntArray([2, 0])
	}

	       if (e[9] == value)
	{
		return new WebGLIntArray([2, 1])
	}

	       if (e[10] == value)
	{
		return new WebGLIntArray([2, 2])
	}

	       if (e[11] == value)
	{
		return new WebGLIntArray([2, 3])
	}

	       if (e[12] == value)
	{
		return new WebGLIntArray([3, 0])
	}

	       if (e[13] == value)
	{
		return new WebGLIntArray([3, 1])
	}

	       if (e[14] == value)
	{
		return new WebGLIntArray([3, 2])
	}

	       if (e[15] == value)
	{
		return new WebGLIntArray([3, 3])
	}

	       return null;
};

mat4.prototype.diagonal = function ()
{
	var els = this.elements;
	return [els[0], els[5], els[10], els[15]];
}

mat4.prototype.determinant = mat4.prototype.det = function ()
{
	var m1 = this.elements,
	    m00 = m1[0], m01 = m1[4], m02 = m1[8], m03 = m1[12],
	    m10 = m1[1], m11 = m1[5], m12 = m1[9], m13 = m1[13],
	    m20 = m1[2], m21 = m1[6], m22 = m1[10], m23 = m1[14],
	    m30 = m1[3], m31 = m1[7], m32 = m1[11], m33 = m1[15];

	return m03 * m12 * m21 * m30 - m02 * m13 * m21 * m30 - m03 * m11 * m22 * m30 + m01 * m13 * m22 * m30 +
	       m02 * m11 * m23 * m30 - m01 * m12 * m23 * m30 - m03 * m12 * m20 * m31 + m02 * m13 * m20 * m31 +
	       m03 * m10 * m22 * m31 - m00 * m13 * m22 * m31 - m02 * m10 * m23 * m31 + m00 * m12 * m23 * m31 +
	       m03 * m11 * m20 * m32 - m01 * m13 * m20 * m32 - m03 * m10 * m21 * m32 + m00 * m13 * m21 * m32 +
	       m01 * m10 * m23 * m32 - m00 * m11 * m23 * m32 - m02 * m11 * m20 * m33 + m01 * m12 * m20 * m33 +
	       m02 * m10 * m21 * m33 - m00 * m12 * m21 * m33 - m01 * m10 * m22 * m33 + m00 * m11 * m22 * m33;
}

mat4.prototype.isSingular = function ()
{
	return (this.determinant() === 0);
}

mat4.prototype.trace = mat4.prototype.tr = function ()
{
	var e = this.elements;
	return (e[0] + e[5] + e[10] + e[15])
}

       mat4.prototype.inverse = function ()
{
	var mat = this.elements;
	// Cache the mat4 values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
	var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
	var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];

	var b00 = a00 * a11 - a01 * a10;
	var b01 = a00 * a12 - a02 * a10;
	var b02 = a00 * a13 - a03 * a10;
	var b03 = a01 * a12 - a02 * a11;
	var b04 = a01 * a13 - a03 * a11;
	var b05 = a02 * a13 - a03 * a12;
	var b06 = a20 * a31 - a21 * a30;
	var b07 = a20 * a32 - a22 * a30;
	var b08 = a20 * a33 - a23 * a30;
	var b09 = a21 * a32 - a22 * a31;
	var b10 = a21 * a33 - a23 * a31;
	var b11 = a22 * a33 - a23 * a32;

	// Calculate the determinant (inlined to avoid double-caching)
	var invDet = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);

	mat[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
	mat[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
	mat[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
	mat[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
	mat[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
	mat[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
	mat[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
	mat[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
	mat[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
	mat[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
	mat[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
	mat[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
	mat[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
	mat[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
	mat[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
	mat[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;


	return this;
}

mat4.prototype.view = function ()
{
	var e = this.elements;
	return "[ " + e[0] + " , " + e[4] + " , " + e[8] + " , " + e[12] + " ] \n " +
	       "[ " + e[1] + " , " + e[5] + " , " + e[9] + " , " + e[13] + " ] \n " +
	       "[ " + e[2] + " , " + e[6] + " , " + e[10] + " , " + e[14] + " ] \n " +
	       "[ " + e[3] + " , " + e[7] + " , " + e[11] + " , " + e[15] + " ]";
};

mat4.prototype.rand = function ()
{

	var e = this.elements;

	e[0] = Math.random() * 1000;
	e[1] = Math.random() * 1000;
	e[2] = Math.random() * 1000;
	e[3] = Math.random() * 1000;
	e[4] = Math.random() * 1000;
	e[5] = Math.random() * 1000;
	e[6] = Math.random() * 1000;
	e[7] = Math.random() * 1000;
	e[8] = Math.random() * 1000;
	e[9] = Math.random() * 1000;
	e[10] = Math.random() * 1000;
	e[11] = Math.random() * 1000;
	e[12] = Math.random() * 1000;
	e[13] = Math.random() * 1000;
	e[14] = Math.random() * 1000;
	e[15] = Math.random() * 1000;

	return this;
};

mat4.I = function ()
{
	return (new mat4());
}
mat4.set = mat4.$ = function ()
{
	var elements = arguments[15] ? [arguments[0], arguments[1], arguments[2], arguments[3],
	                                arguments[4], arguments[5], arguments[6], arguments[7],
	                                arguments[8], arguments[9], arguments[10], arguments[11],
	                                arguments[12], arguments[13], arguments[14], arguments[15]] : arguments[0];
	return (new mat4(elements));
}
mat4.makeFrustum = function (left, right, bottom, top, znear, zfar)
{
	return new mat4([2 * znear / (right - left),
	                 0,
	                 0,
	                 0,
	                 0,
	                 2 * znear / (top - bottom),
	                 0,
	                 0,
	                 (right + left) / (right - left),
	                 (top + bottom) / (top - bottom),
	                 -(zfar + znear) / (zfar - znear),
	                 -1,
	                 0,
	                 0,
	                 -2 * zfar * znear / (zfar - znear),
	                 0]);
}

mat4.makePerspective = function (fovy, aspect, znear, zfar)
{

	var top = znear * Math.tan(fovy * Math.PI / 360.0),
	    bottom = -top,
	    left = bottom * aspect,
	    right = top * aspect;

	return new mat4([2 * znear / (right - left),
	                 0,
	                 0,
	                 0,
	                 0,
	                 2 * znear / (top - bottom),
	                 0,
	                 0,
	                 (right + left) / (right - left),
	                 (top + bottom) / (top - bottom),
	                 -(zfar + znear) / (zfar - znear),
	                 -1,
	                 0,
	                 0,
	                 -2 * zfar * znear / (zfar - znear),
	                 0]);
};

mat4.makeOrtho = function (left, right, bottom, top, znear, zfar)
{
	return new mat4([2 / (right - left),
	                 0,
	                 0,
	                 0,
	                 0,
	                 2 / (top - bottom),
	                 0,
	                 0,
	                 0,
	                 0,
	                 -2 / (zfar - znear),
	                 0,
	                 -(right + left) / (right - left),
	                 -(top + bottom) / (top - bottom),
	                 -(zfar + znear) / (zfar - znear),
	                 0]);
};

mat4.makeRotate = function (angle, axis)
{
	var normAxis = axis.elements ? axis.normalize() : vec3.set(axis).normalize();
	var nAxis = normAxis.elements;
	var x = nAxis[0], y = nAxis[1], z = nAxis[2];
	var c = Math.cos(angle),
	    c1 = 1 - c,
	    s = Math.sin(angle);
	return new mat4([x * x * c1 + c,
	                 y * x * c1 + z * s,
	                 z * x * c1 - y * s,
	                 0,
	                 x * y * c1 - z * s,
	                 y * y * c1 + c,
	                 y * z * c1 + x * s,
	                 0,
	                 x * z * c1 + y * s,
	                 y * z * c1 - x * s,
	                 z * z * c1 + c,
	                 0,
	                 0,
	                 0,
	                 0,
	                 1]);
};

mat4.makeScale = function (x, y, z)
{
	x = x || 1;
	y = y || 1;
	z = z || 1;
	return new mat4([x,0,0,0,
	                 0,y,0,0,
	                 0,0,z,0,
	                 0,0,0,1]);
};

mat4.makeTranslate = function (x, y, z)
{
	x = x || 0;
	y = y || 0;
	z = z || 0;
	return new mat4([1,0,0,0,
	                 0,1,0,0,
	                 0,0,1,0,
			 x,y,z,1 ]);
};

function matMul(res, a, b)
{
	var r = res.elements, m1 = a.elements, m2 = b.elements,

	m10 = m1[0], m11 = m1[4], m12 = m1[8], m13 = m1[12],
	m14 = m1[1], m15 = m1[5], m16 = m1[9], m17 = m1[13],
	m18 = m1[2], m19 = m1[6], m110 = m1[10], m111 = m1[14],
	m112 = m1[3], m113 = m1[7], m114 = m1[11], m115 = m1[15],

	m20 = m2[0], m21 = m2[4], m22 = m2[8], m23 = m2[12],
	m24 = m2[1], m25 = m2[5], m26 = m2[9], m27 = m2[13],
	m28 = m2[2], m29 = m2[6], m210 = m2[10], m211 = m2[14],
	m212 = m2[3], m213 = m2[7], m214 = m2[11], m215 = m2[15];



	r[0] = m10 * m20 + m11 * m24 + m12 * m28 + m13 * m212;
	r[1] = m14 * m20 + m15 * m24 + m16 * m28 + m17 * m212;
	r[2] = m18 * m20 + m19 * m24 + m110 * m28 + m111 * m212;
	r[3] = m112 * m20 + m113 * m24 + m114 * m28 + m115 * m212;

	r[4] = m10 * m21 + m11 * m25 + m12 * m29 + m13 * m213;
	r[5] = m14 * m21 + m15 * m25 + m16 * m29 + m17 * m213;
	r[6] = m18 * m21 + m19 * m25 + m110 * m29 + m111 * m213;
	r[7] = m112 * m21 + m113 * m25 + m114 * m29 + m115 * m213;

	r[8] = m10 * m22 + m11 * m26 + m12 * m210 + m13 * m214;
	r[9] = m14 * m22 + m15 * m26 + m16 * m210 + m17 * m214;
	r[10] = m18 * m22 + m19 * m26 + m110 * m210 + m111 * m214;
	r[11] = m112 * m22 + m113 * m26 + m114 * m210 + m115 * m214;

	r[12] = m10 * m23 + m11 * m27 + m12 * m211 + m13 * m215;
	r[13] = m14 * m23 + m15 * m27 + m16 * m211 + m17 * m215;
	r[14] = m18 * m23 + m19 * m27 + m110 * m211 + m111 * m215;
	r[15] = m112 * m23 + m113 * m27 + m114 * m211 + m115 * m215;


}

var vec3 = function (x, y, z)
{
	this.elements = new glMatrixArrayType([0, 0, 0]);
	this.elements[0] = x || 0;
	this.elements[1] = y || 0;
	this.elements[2] = z || 0;
	return this;
};

vec3.prototype.setElements = function (vec3)
{
	this.elements[0] = vec3[0];
	this.elements[1] = vec3[1];
	this.elements[2] = vec3[2];

	return this;
};

vec3.prototype.add = function (vec3)
{
	var a = this.elements,
	    b = vec3.elements;

	a[0] = a[0] + b[0];
	a[1] = a[1] + b[1];
	a[2] = a[2] + b[2];

	return this;
}

vec3.prototype.sub = function (vec3)
{
	var a = this.elements,
	    b = vec3.elements;

	a[0] = a[0] - b[0];
	a[1] = a[1] - b[1];
	a[2] = a[2] - b[2];

	return this;
}


vec3.prototype.mul = function (vec3)
{
	var a = this.elements,
	    b = vec3.elements,
	    a0 = a[0], a1 = a[1], a2 = a[2],
	    b0 = b[0], b1 = b[1], b2 = b[2];

	a[0] = a1 * b2 - a2 * b1;
	a[1] = a2 * b0 - a0 * b2;
	a[2] = a0 * b1 - a1 * b0;

	return this;
}

vec3.prototype.length = function ()
{
	var a = this.elements;

	return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
};

vec3.prototype.dot = function (vec3)
{
	var a = this.elements,
	    b = vec3.elements;

	return a[0] * b[0] +
	       a[1] * b[1] +
	       a[2] * b[2];
};

vec3.prototype.normalize = function ()
{
	var a = this.elements,
	    l = 1 / Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);

	a[0] = a[0] * l;
	a[1] = a[1] * l;
	a[2] = a[2] * l;

	return this;
}

vec3.set = function ()
{
	var elements = arguments[2] ? [arguments[0], arguments[1], arguments[2]] : arguments[0];
	return (new mat4(elements));
}

window.v3 = vec3;
window.m4 = mat4;
