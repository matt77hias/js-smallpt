Vector3 = function (x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}

Vector3.prototype = {
	constructor : Vector3,
	
	copy: function () {
		return new Vector3(this.x, this.y, this.z);
	},
	
	set: function (x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	},
	
	get : function (index) {
		switch (index) {
			case 0:
				return this.x;
			case 1:
				return this.y;
			default: 
				return this.z;
		}
	},
	getX : function () {
		return this.x;
	},
	getY : function () {
		return this.y;
	},
	getZ : function () {
		return this.z;
	},
	
	min_dimension: function () {
		return (this.x < this.y && this.x < this.z) ? 0 : ((this.y < this.z) ? 1 : 2);
	},
	max_dimension: function () {
		return (this.x > this.y && this.x > this.z) ? 0 : ((this.y > this.z) ? 1 : 2);
	},
	min_value: function () {
		return (this.x < this.y && this.x < this.z) ? this.x : ((this.y < this.z) ? this.y : this.z);
	},
	max_value: function () {
		return (this.x > this.y && this.x > this.z) ? this.x : ((this.y > this.z) ? this.y : this.z);
	},
	
	norm2_squared: function () {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	},
	norm2: function () {
		return Math.sqrt(this.norm2_squared());
	},
	normalize: function () {
		let a = 1.0 / this.norm2();
		this.x *= a;
		this.y *= a;
		this.z *= a;
		return this;
	}
}

Vector3.minus = function (v) {
	return new Vector3(-v.x, -v.y, -v.z);
}
Vector3.add = function (v1, v2) {
	return (v1 instanceof Vector3) ? ((v2 instanceof Vector3) ? new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z) : new Vector3(v1.x + v2, v1.y + v2, v1.z + v2)) : ((v2 instanceof Vector3) ? new Vector3(v1 + v2.x, v1 + v2.y, v1 + v2.z) : v1 + v2);
}
Vector3.sub = function (v1, v2) {
	return (v1 instanceof Vector3) ? ((v2 instanceof Vector3) ? new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z) : new Vector3(v1.x - v2, v1.y - v2, v1.z - v2)) : ((v2 instanceof Vector3) ? new Vector3(v1 - v2.x, v1 - v2.y, v1 - v2.z) : v1 - v2);
}
Vector3.mul = function (v1, v2) {
	return (v1 instanceof Vector3) ? ((v2 instanceof Vector3) ? new Vector3(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z) : new Vector3(v1.x * v2, v1.y * v2, v1.z * v2)) : ((v2 instanceof Vector3) ? new Vector3(v1 * v2.x, v1 * v2.y, v1 * v2.z) : v1 * v2);
}
Vector3.div = function (v1, v2) {
	return (v1 instanceof Vector3) ? ((v2 instanceof Vector3) ? new Vector3(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z) : new Vector3(v1.x / v2, v1.y / v2, v1.z / v2)) : ((v2 instanceof Vector3) ? new Vector3(v1 / v2.x, v1 / v2.y, v1 / v2.z) : v1 / v2);
}

Vector3.dot = function (v1, v2) {
	return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}
Vector3.cross = function (v1, v2) {
	return new Vector3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
}

Vector3.eq = function (v1, v2) {
	return v1.x == v2.x && v1.y == v2.y && v1.z == v2.z;
}
Vector3.ne = function (v1, v2) {
	return v1.x != v2.x || v1.y != v2.y || v1.z != v2.z;
}
Vector3.lt = function (v1, v2) {
	return v1.x < v2.x && v1.y < v2.y && v1.z < v2.z;
}
Vector3.le = function (v1, v2) {
	return v1.x <= v2.x && v1.y <= v2.y && v1.z <= v2.z;
}
Vector3.gt = function (v1, v2) {
	return v1.x > v2.x && v1.y > v2.y && v1.z > v2.z;
}
Vector3.ge = function (v1, v2) {
	return v1.x >= v2.x && v1.y >= v2.y && v1.z >= v2.z;
}

Vector3.apply_unary = function (f, v) {
	return new Vector3(f(v.x), f(v.y), f(v.z));
}
Vector3.apply_binary = function (f, v1, v2) {
	return new Vector3(f(v1.x, v2.x), f(v1.y, v2.y), f(v1.z, v2.z));
}

Vector3.sqrt = function (v) {
	return Vector3.apply_unary(Math.sqrt, v);
}
Vector3.pow = function (v, e) {
	let fixed_pow = function (a) { return Math.pow(a, e); };
	return Vector3.apply_unary(fixed_pow, v);
}
Vector3.abs = function (v) {
	return Vector3.apply_unary(Math.abs, v);
}
Vector3.min = function (v1, v2) {
	return Vector3.apply_binary(Math.min, v1, v2);
}
Vector3.max = function (v1, v2) {
	return Vector3.apply_binary(Math.max, v1, v2);
}
Vector3.round = function (v) {
	return Vector3.apply_unary(Math.round, v);
}
Vector3.ceil = function (v) {
	return Vector3.apply_unary(Math.ceil, v);
}
Vector3.floor = function (v) {
	return Vector3.apply_unary(Math.floor, v);
}
Vector3.trunc = function (v) {
	return Vector3.apply_unary(Math.trunc, v);
}
Vector3.clamp = function (v, low, high) {
	let fixed_clamp = function (a) { return clamp(a, low, high); };
	return Vector3.apply_unary(fixed_clamp, v);
}
Vector3.lerp = function (a, v1, v2) {
	return Vector3.add(v1, Vector3.mul(a, Vector3.sub(v2, v1)));
}
Vector3.permute = function (v, x, y, z) {
	return new Vector3(v.get(x), v.get(y), v.get(z));
}