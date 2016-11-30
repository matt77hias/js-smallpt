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
		let op = Vector3.sub(this.p, ray.o);
		let dop = Vector3.dot(ray.d, op);
		let D = dop * dop - Vector3.dot(op, op) + this.r * this.r;

		if (D < 0) {
			return false;
		}

		let sqrtD = Math.sqrt(D);

		let tmin = dop - sqrtD;
		if (ray.tmin < tmin && tmin < ray.tmax) {
			ray.tmax = tmin;
			return true;
		}

		let tmax = dop + sqrtD;
		if (ray.tmin < tmax && tmax < ray.tmax) {
			ray.tmax = tmax;
			return true;
		}
		
		return false;
	}
}