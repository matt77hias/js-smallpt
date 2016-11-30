Ray = function (o, d, tmin, tmax, depth) {
	this.o = o.copy();
	this.d = d.copy();
	this.tmin = tmin;
	this.tmax = tmax;
	this.depth = depth;
}

Ray.prototype = {
	constructor : Ray,
	
	eval: function (t) {
		return Vector3.add(this.o, Vector3.mul(this.d, t));
	}
}