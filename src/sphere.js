const DIFFUSE = 0;
const SPECULAR = 1;
const REFRACTIVE = 2;

Sphere = function (r, p, e, f, reflection_t) {
	this.r = r;
	this.p = p.copy();
	this.e = e.copy();
	this.f = f.copy();
	this.reflection_t = reflection_t;
}

const EPSILON_SPHERE = 1.0e-4;

Sphere.prototype = {
	constructor : Sphere,
	
	intersect: function (ray) {
		var op = Vector3.sub(this.p, ray.o);
		var dop = Vector3.dot(ray.d, op);
		var D = dop * dop - Vector3.dot(op, op) + this.r * this.r;

		if (D < 0) {
			return false;
		}

		var sqrtD = Math.sqrt(D);

		var tmin = dop - sqrtD;
		if (ray.tmin < tmin && tmin < ray.tmax) {
			ray.tmax = tmin;
			return true;
		}

		var tmax = dop + sqrtD;
		if (ray.tmin < tmax && tmax < ray.tmax) {
			ray.tmax = tmax;
			return true;
		}
		
		return false;
	}
}