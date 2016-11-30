const GAMMA = 2.2;

write_ppm = function (w, h, Ls) {

}

display = function (w, h, Ls) {
    var canvas = document.getElementById("smallpt-canvas");
    var context = canvas.getContext("2d");

    for (var y = 0; y < h; ++y) {
        for (var x = 0; x < w; ++x) {
            var L = Ls[y * w + x];
            context.fillStyle = "rgba(" + to_byte(L.x, GAMMA) + ", " + to_byte(L.y, GAMMA) + ", " + to_byte(L.z, GAMMA) + ", 1.0)";
            context.fillRect(x, y, 1, 1);
        }
    }
}