// Scene
const REFRACTIVE_INDEX_OUT = 1.0;
const REFRACTIVE_INDEX_IN = 1.5;

const spheres = [
		new Sphere(1e5,  new Vector3(1e5 + 1, 40.8, 81.6),   new Vector3(0.0, 0.0, 0.0),    new Vector3(0.75, 0.25, 0.25), DIFFUSE),    //Left
		new Sphere(1e5,  new Vector3(-1e5 + 99, 40.8, 81.6), new Vector3(0.0, 0.0, 0.0),    new Vector3(0.25, 0.25, 0.75), DIFFUSE),	  //Right
		new Sphere(1e5,  new Vector3(50, 40.8, 1e5),         new Vector3(0.0, 0.0, 0.0),    new Vector3(0.75, 0.75, 0.75),   DIFFUSE),	  //Back
		new Sphere(1e5,  new Vector3(50, 40.8, -1e5 + 170),  new Vector3(0.0, 0.0, 0.0),    new Vector3(0.0, 0.0, 0.0),    DIFFUSE),	  //Front
		new Sphere(1e5,  new Vector3(50, 1e5, 81.6),         new Vector3(0.0, 0.0, 0.0),    new Vector3(0.75, 0.75, 0.75),   DIFFUSE),    //Bottom
		new Sphere(1e5,  new Vector3(50, -1e5 + 81.6, 81.6), new Vector3(0.0, 0.0, 0.0),    new Vector3(0.75, 0.75, 0.75),   DIFFUSE),	  //Top
		new Sphere(16.5, new Vector3(27, 16.5, 47),          new Vector3(0.0, 0.0, 0.0),    new Vector3(0.999, 0.999, 0.999),  SPECULAR),	  //Mirror
		new Sphere(16.5, new Vector3(73, 16.5, 78),          new Vector3(0.0, 0.0, 0.0),    new Vector3(0.999, 0.999, 0.999),  REFRACTIVE), //Glass
		new Sphere(600,  new Vector3(50, 681.6 - .27, 81.6), new Vector3(12.0, 12.0, 12.0), new Vector3(0.0, 0.0, 0.0),    DIFFUSE)	  //Light
	];

function intersect_scene(ray) {
	var id = 0
	var hit = false
	for (var i = 0; i < spheres.length; ++i) {
		if (spheres[i].intersect(ray)) {
			hit = true;
			id = i;
		}
	}
	return [hit, id]
}

// Radiance
function radiance(ray) {
	var r = ray;
	var L = new Vector3(0.0, 0.0, 0.0);
	var F = new Vector3(1.0, 1.0, 1.0);

	while (true) {
		var hit_record = intersect_scene(r);
		var hit = hit_record[0];
		if (!hit) {
			return L;
		}
		
		var id  = hit_record[1];
		var shape = spheres[id];
		var p = r.eval(r.tmax);
		var n = Vector3.sub(p, shape.p).normalize();

		L = Vector3.add(L, Vector3.mul(F, shape.e));
		F = Vector3.mul(F, shape.f);
		
		// Russian roulette
		if (r.depth > 4) {
			var continue_probability = shape.f.max_value();
			if (uniform_float() >= continue_probability) {
				return L;
			}
			F = Vector3.div(F, continue_probability);
		}

		// Next path segment
		switch (shape.reflection_t) {
			case SPECULAR:
				var d = ideal_specular_reflect(r.d, n);
				r = new Ray(p, d, EPSILON_SPHERE, Infinity, r.depth + 1);
				continue;
			case REFRACTIVE:
				var refraction_record = ideal_specular_transmit(r.d, n, REFRACTIVE_INDEX_OUT, REFRACTIVE_INDEX_IN);
				var d  = refraction_record[0];
				var pr = refraction_record[1];
				F = Vector3.mul(F, pr);
				r = new Ray(p, d, EPSILON_SPHERE, Infinity, r.depth + 1);
				continue
			default:
				var w = (Vector3.dot(n, r.d) < 0) ? n : Vector3.minus(n);
				var u = Vector3.cross((Math.abs(w.x) > 0.1) ? new Vector3(0.0, 1.0, 0.0) : new Vector3(1.0, 0.0, 0.0), w).normalize();
				var v = Vector3.cross(w, u);

				var sample_d = cosine_weighted_sample_on_hemisphere(uniform_float(), uniform_float());
				var d = Vector3.add(Vector3.add(Vector3.mul(sample_d.x, u), Vector3.mul(sample_d.y, v)), Vector3.mul(sample_d.z, w)).normalize();
				r = new Ray(p, d, EPSILON_SPHERE, Infinity, r.depth + 1);
				continue;
		}   
	}
}

// Main
function main() {
	var t0 = performance.now();

	var nb_samples = 64 / 4;
	var w = 1024;
	var h = 768;

	var eye = new Vector3(50, 52, 295.6);
	var gaze = new Vector3(0, -0.042612, -1).normalize();
	
	var fov = 0.5135;
	var cx = new Vector3(w * fov / h, 0.0, 0.0);
	var cy = Vector3.mul(Vector3.cross(cx, gaze).normalize(), fov);

	var Ls = [];
	for (var j = 0; j < w * h; ++j) {
		Ls.push(new Vector3(0.0, 0.0, 0.0));
	}
	
	for (var y = 0; y < h; ++y) {
		// pixel row
		console.log("\rRendering (" + (nb_samples * 4) + " spp) " + (100.0 * y / (h - 1)).toFixed(2) + "%");
		for (var x = 0; x < w; ++x) {
			// pixel column
			for (var sy = 0; sy < 2; ++sy) {
				var i = (h - 1 - y) * w + x;
				// 2 subpixel row
				for (var sx = 0; sx < 2; ++sx) {
					// 2 subpixel column
					var L = new Vector3(0.0, 0.0, 0.0);
					for (var s = 0; s < nb_samples; ++s) {
						//  samples per subpixel
						var u1 = 2.0 * uniform_float();
						var u2 = 2.0 * uniform_float();
						var dx = (u1 < 1) ? Math.sqrt(u1) - 1.0 : 1.0 - Math.sqrt(2.0 - u1);
						var dy = (u2 < 1) ? Math.sqrt(u2) - 1.0 : 1.0 - Math.sqrt(2.0 - u2);
						var d = Vector3.add(Vector3.add(Vector3.mul(cx, (((sx + 0.5 + dx) / 2.0 + x) / w - 0.5)), Vector3.mul(cy, (((sy + 0.5 + dy) / 2.0 + y) / h - 0.5))), gaze);
						L = Vector3.add(L, Vector3.mul(radiance(new Ray(Vector3.add(eye, Vector3.mul(d, 130)), d.normalize(), EPSILON_SPHERE, Infinity, 0)), (1.0 / nb_samples)));
					}
					Ls[i] = Vector3.add(Ls[i], Vector3.mul(0.25, Vector3.clamp(L, 0.0, 1.0)));
				}
			}
		}
	}

	write_ppm(w, h, Ls);

	var t1 = performance.now();
	console.log("Rendering time: " + (t1 - t0) + " ms");

	display(w, h, Ls);
}