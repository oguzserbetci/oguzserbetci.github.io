var WAVEFORM_MOVEMENT = 50;
var SPACE = 0;

var song;
var second;
var offset = WAVEFORM_MOVEMENT / 2;
var bgHue;

var fft;
var amplitude;

var level = 0;
var popped;
var left_level = 0;
var right_level = 0;
var eased_left_level = 0;
var eased_right_level = 0;

function randomBg() {
    bgHue = random(1);
    background(color(bgHue, 1, 0.2));
}

function triad(hue) {
    hue1 = (hue + 0.33) % 1;
    hue2 = (hue + 0.66) % 1;
    return [hue, hue1, hue2];
}

// watch spotify variables
var spotifyVariables = ["bars", "beats", "sections", "segments", "tatums"];
var spotifyCallbacks = {
    "beats": function(popped) {},
    "tatums": function(popped) {},
    "segments": function(popped) {
        if (popped.confidence > 0.6) {
            randomBg();
        }
    }
};

function popSpotifyVariable(varName) {
    popped = horizon_analysis[varName][0];
    horizon_analysis[varName].shift();
    return popped;
}

var poppedSpotifyVariables = {};

function checkSpotify(start) {
    for (varName of spotifyVariables) {
        if (start || poppedSpotifyVariables[varName].start < second) {
            popped = popSpotifyVariable(varName);
            poppedSpotifyVariables[varName] = popped;
            if (spotifyCallbacks[varName] != null) {
                spotifyCallbacks[varName](popped);
            }
            console.log("new " + varName);
        }
    }
}
var easedLevel = 0;

var easeCache = {
    "mouseX": 0,
    "mouseY": 0,
    "level": 0
};
var easing = {
    "mouseX": 0.1,
    "mouseY": 0.1,
    "level": 0.05
};

function ease(key, val) {
    dx = val - easeCache[key];
    easeCache[key] += dx * easing[key];
    return easeCache[key];
}

function preload() {
    // song = loadSound('./03 - Flatiron.mp3');
    song = loadSound('Soft_and_Furious_-_09_-_Horizon_Ending.mp3');
}

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);

    colorMode(HSB, 1);
    SPACE = max(width, height);

    canvas.mouseClicked(togglePlay);
    fft = new p5.FFT();
    amplitude = new p5.Amplitude();
    randomBg();
    checkSpotify(true);
}

// draw
function draw() {
    if (song.isPlaying()) {
        second = song.currentTime();

        level = amplitude.getLevel();
        easedLevel = ease("level", level);

        background(color(bgHue, 1, 0.2, 0.2));
        checkSpotify(false);

        var spectrum = fft.analyze();
        if (fft.getEnergy("treble") > 150) {
            offset = WAVEFORM_MOVEMENT / 2;
        }

        var bands = fft.logAverages(fft.getOctaveBands(2));
        var trebleEnergy = fft.getEnergy("treble");
        for (var i = 0; i < bands.length; i++) {
            if (bands[i] > 100) {
                noFill();
                stroke(color(bgHue, 1, map(trebleEnergy, 0, 255, 0.6, 1), 0.2));
                strokeWeight(Math.pow(map(bands[i], 100, 255, 1, 5),2));
                easedWidth = map(i, 0, bands.length - 1, 50, SPACE);
                ellipse(width / 2, height / 2, Math.pow(easedWidth * easedLevel/5, 2));
            }
        }

        rectMode(CENTER);
        noFill();
        stroke(color(bgHue, 1, 1));
        strokeWeight(1);
        rect(width / 2, height / 2, offset, height);
        rect(width / 2, height / 2, width, offset);
        offset += WAVEFORM_MOVEMENT;

        var waveform = fft.waveform();
        fft.smooth(0.1);
        noFill();
        beginShape();
        strokeWeight(1);
        for (var i = 0; i < waveform.length; i++) {
            var x = map(i, 0, waveform.length, 0, width);
            var point = smoothPoint(waveform, i, 50);
            var y = map(point, -1, 1, 0, height / 2);
            if (trebleEnergy > 130) {
                stroke(triad(bgHue)[1], 1, 1);
            } else {
                stroke(triad(bgHue)[2], 1, 1);
            }
            vertex(x, y + offset);
        }
        endShape();
    }
}
// average a point in an array with its neighbors
function smoothPoint(spectrum, index, numberOfNeighbors) {

    // default to 2 neighbors on either side
    var neighbors = numberOfNeighbors || 2;
    var len = spectrum.length;

    var val = 0;

    // start below the index
    var indexMinusNeighbors = index - neighbors;
    var smoothedPoints = 0;

    for (var i = indexMinusNeighbors; i < (index+neighbors) && i < len; i++) {
        // if there is a point at spectrum[i], tally it
        if (typeof(spectrum[i]) !== 'undefined') {
            val += spectrum[i];
            smoothedPoints++;
        }
    }

    val = val/smoothedPoints;

    return val;
}
function togglePlay() {
    if (song.isPlaying()) {
        song.pause();
    } else {
        song.play();
    }
}
