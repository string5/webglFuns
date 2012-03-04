//========================================================================//
//      Copyright 2012, Smilodon Studio Inc.
//      All rights reserved.
//========================================================================//

/**
 *	canvas util
 *      @author: CYS
 */



/**
*	Provides requestAnimationFrame in a cross browser way.
*/
window.requestAnimFrame = (function ()
{
	return window.requestAnimationFrame ||
	       window.webkitRequestAnimationFrame ||
	       window.mozRequestAnimationFrame ||
	       window.oRequestAnimationFrame ||
	       window.msRequestAnimationFrame ||
	       function (/* function FrameRequestCallback */callback, /* DOMElement Element */element)
	{
		return window.setTimeout(callback, 1000 / 60);
	};
})();

/**
*	Provides cancelRequestAnimationFrame in a cross browser way.
*/
window.cancelRequestAnimFrame = (function ()
{
	return window.cancelCancelRequestAnimationFrame ||
	       window.webkitCancelRequestAnimationFrame ||
	       window.mozCancelRequestAnimationFrame ||
	       window.oCancelRequestAnimationFrame ||
	       window.msCancelRequestAnimationFrame ||
	       window.clearTimeout;
})();



/**
*	Provides random number.
*/
function rnd(m)
{
	return Math.random()*m;
}


function rndi(m)
{
	return Math.floor(rnd(m));
}

function rndd(m, n)
{
	return Math.random()*(n - m) + m;
}

function dis2(x, y, x0, y0)
{
	return (x - x0)*(x - x0) + (y - y0)*(y - y0);
}
function rgba(r,g,b,a)
{
	return "rgba(" + r +"," + g + "," + b + "," + a +")";
}


function infoPad()
{
	this.visble = false;
	this.infos = [];
	this.infoEle = document.getElementById("infoPad");
	
	infoPad.prototype.add = function(name, val)
	{
		for(var i = 0; i < this.infos.length; i++)
		{
			if(this.infos[i].name === name) 
			{
				this.infos[i].val = val;
				return;
			}
		}
		var inf = {}; inf.name = name; inf.val = val;		
		this.infos.push(inf);
	}
	
	infoPad.prototype.show = function()
	{
		if(this.visble) 
		{
			this.infoEle.style.visibility = 'visible';
			this.infoEle.value = "";
			for(var i = 0; i < this.infos.length; i++)
			{
				this.infoEle.value += this.infos[i].name + ":   " + this.infos[i].val + "\n";
			}
		}
		else this.infoEle.style.visibility = 'hidden';
	}
}



function initSounds() 
{
	burstSound = new Audio("sounds/arrp.wav");	
				burstSound.load();
				// you have to play the sound to make sure it's loaded, otherwise you get 
				// a glitch the first time you play it
				burstSound.volume = 0; 
				burstSound.play(); 
			
}

function playBurst()
{ 
	burstSound.volume = 1; 
	burstSound.play(); 
}

/**
*	Gravity sensor.
*/ 
function Orientation(selector)
{
	this.ox = 0;
}

Orientation.prototype.init = function()
{
	window.addEventListener('deviceorientation', this.orientationListener, false);
	window.addEventListener('MozOrientation', this.orientationListener, false);
	window.addEventListener('devicemotion', this.orientationListener, false);
}

Orientation.prototype.orientationListener = function(evt)
{
	// For FF3.6+
	if (!evt.gamma && !evt.beta)
	{
		// angle=radian*180.0/PI 在firefox中x和y是弧度值,
		evt.gamma = (evt.x * (180 / Math.PI)); //转换成角度值,
		evt.beta = (evt.y * (180 / Math.PI)); //转换成角度值
		evt.alpha = (evt.z * (180 / Math.PI)); //转换成角度值
	}

	/* beta:  -180..180 (rotation around x axis) */
	/* gamma:  -90..90  (rotation around y axis) */
	/* alpha:    0..360 (rotation around z axis) (-180..180) */

	var gamma = evt.gamma;
	var beta = evt.beta;
	var alpha = evt.alpha;

	if(evt.accelerationIncludingGravity)
	{
		// window.removeEventListener('deviceorientation', this.orientationListener, false);
		gamma = event.accelerationIncludingGravity.x*10;
		beta = -event.accelerationIncludingGravity.y*10;
		alpha = event.accelerationIncludingGravity.z*10;
	}

	if (this._lastGamma != gamma || this._lastBeta != beta)
	{
		document.querySelector("#test").innerHTML = "x: "+ beta.toFixed(2) + " y: " + gamma.toFixed(2) + " z: " + (alpha != null?alpha.toFixed(2):0)


		var style = document.querySelector("#pointer").style;
		style.left = gamma/90 * 200 + 200 +"px";
		style.top = beta/90 * 100 + 100 +"px";


		this._lastGamma = gamma;
		this._lastBeta = beta;
	}
};
