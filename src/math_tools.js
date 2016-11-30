const M_PI = 3.14159265358979323846;

clamp = function (x, low, high) {
    return (x > high) ? high : ((x < low) ? low : x);
}

to_byte = function (x, gamma) {
    return Math.trunc(clamp(255.0 * Math.pow(x, 1.0 / gamma), 0.0, 255.0));
}