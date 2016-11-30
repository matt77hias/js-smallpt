function reflectance0(n1, n2) {
    let sqrt_R0 = (n1 - n2) / (n1 + n2);
    return sqrt_R0 * sqrt_R0;
}

function schlick_reflectance(n1, n2, c) {
    let R0 = reflectance0(n1, n2);
    return R0 + (1 - R0) * c * c * c * c * c;
}

function ideal_specular_reflect(d, n) {
    return Vector3.sub(d, Vector3.mul(2.0 * Vector3.dot(n, d), n));
}

function ideal_specular_transmit(d, n, n_out, n_in) {
    let d_Re = ideal_specular_reflect(d, n);

    let out_to_in = Vector3.dot(n, d) < 0;
    let nl = out_to_in ? n : Vector3.minus(n);
    let nn = out_to_in ? n_out / n_in : n_in / n_out;
    let cos_theta = Vector3.dot(d, nl);
    let cos2_phi = 1.0 - nn * nn * (1.0 - cos_theta * cos_theta);

    // Total Internal Reflection
    if (cos2_phi < 0) {
        return [d_Re, 1.0];
    }

    let d_Tr = Vector3.sub(Vector3.mul(nn, d), Vector3.mul(nl, (nn * cos_theta + Math.sqrt(cos2_phi)))).normalize();
    let c = 1.0 - (out_to_in ? -cos_theta : Vector3.dot(d_Tr, n));

    let Re = schlick_reflectance(n_out, n_in, c);
    let p_Re = 0.25 + 0.5 * Re;
    if (uniform_float() < p_Re) {
        return [d_Re, (Re / p_Re)];
    }
    else  {
        let Tr = 1.0 - Re;
        let p_Tr = 1.0 - p_Re;
        return [d_Tr, (Tr / p_Tr)];
    }
}