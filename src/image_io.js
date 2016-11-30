const GAMMA = 2.2;

function write_ppm(w, h, Ls) {
    data = "P3\n" + w + " " + h + "\n255\n"
    for (let y = 0; y < h; ++y) {
        for (let x = 0; x < w; ++x) {
            let L = Ls[y * w + x];
            data += to_byte(L.x, GAMMA) + " " + to_byte(L.y, GAMMA) + " " + to_byte(L.z, GAMMA) + " ";
        }
    }
    download_file(data, "js-smallpt.ppm", "text/plain");
}

function download_file(data, fname, type) {
    let file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) {
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, fname);
    }
    else {
        // Others
        let url = URL.createObjectURL(file);
        let a = document.createElement("a");
        a.href = url;
        a.download = fname;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function display(w, h, Ls) {
    let canvas = document.getElementById("smallpt-canvas");
    let context = canvas.getContext("2d");

    for (let y = 0; y < h; ++y) {
        for (let x = 0; x < w; ++x) {
            let L = Ls[y * w + x];
            context.fillStyle = "rgba(" + to_byte(L.x, GAMMA) + ", " + to_byte(L.y, GAMMA) + ", " + to_byte(L.z, GAMMA) + ", 1.0)";
            context.fillRect(x, y, 1, 1);
        }
    }
}