var WAVEFORM_MOVEMENT = 50;
var SPACE = 0;

var song;
var second;
var offset = WAVEFORM_MOVEMENT/2;
var bgHue;

var fft;
var amplitude;

var level = 0;
var popped;
var left_level = 0;
var right_level = 0;
var eased_left_level = 0;
var eased_right_level = 0;

var quadM;
var easing = 0.01;
var easedMouseX;
var easedMouseY;


Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

Array.prototype.min = function() {
    return Math.min.apply(null, this);
};

Array.prototype.mean = function() {
    if (this.length) {
        sum = this.reduce(function(a, b) {
            return a + b;
        });
        avg = sum / this.length;
        return avg;
    } else {
        return 0;
    }
}

function preload() {
    // song = loadSound('./03 - Flatiron.mp3');
    song = loadSound('Soft_and_Furious_-_09_-_Horizon_Ending.mp3');
}

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 1);
    SPACE = max(width,height);

    canvas.mouseClicked(togglePlay);
    fft = new p5.FFT();
    easedMouseX = mouseX;
    easedMouseY = mouseY;
    amplitude = new p5.Amplitude();
    randomBg();
    checkSpotify(true);
}

function popSpotifyVariable(varName) {
    popped = horizon_analysis[varName][0];
    horizon_analysis[varName].shift();
    return popped;
}

function randomBg() {
    bgHue = random(1);
    background(color(bgHue, 1, 0.2));
}

// watch spotify variables
var spotifyVariables = ["bars", "beats", "sections", "segments", "tatums"];
var spotifyCallbacks = {
    "beats": function(popped) {
    },
    "tatums": function(popped) {
    },
    "segments": function(popped) {
        if (popped.confidence > 0.6) {
            randomBg();
        }
    }
};
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

// draw
function draw() {
    if (song.isPlaying()) {
        console.log("Hello");
        second = song.currentTime();

        level = amplitude.getLevel();
        targetLevel = level;
        dx = targetLevel - easedLevel;
        easedLevel += dx * 0.05;

        left_level = amplitude.getLevel(0);
        right_level = amplitude.getLevel(1);

        // mouse easing
        // targetX = mouseX;
        // dx = targetX - easedMouseX;
        // easedMouseX += dx * easing;

        // targetY = mouseY;
        // dy = targetY - easedMouseY;
        // easedMouseY += dy * easing;

        background(color(bgHue,1,0.2,0.2));
        checkSpotify(false);

        // dx = left_level - eased_left_level;
        // eased_left_level += dx;

        // dx = right_level - eased_right_level;
        // eased_right_level += dx;

        var spectrum = fft.analyze();
        if (fft.getEnergy("treble")>150) {
            offset = WAVEFORM_MOVEMENT/2;
        }

        var bands = fft.logAverages(fft.getOctaveBands(2));
        console.log(bands.length);
        var trebleEnergy = fft.getEnergy("treble");
        for (var i = 0; i < bands.length; i++) {
            if (bands[i] > 100) {
                noFill();
                stroke(color(bgHue, 1, map(trebleEnergy, 0, 255, 0.2, 1)));
                strokeWeight(map(bands[i], 100, 255, 1, 10));
                iRatio = map(i, 0, bands.length-1, 0, 1);
                easedWidth = map(i, 0, bands.length-1, 50, SPACE);
                ellipse(width / 2, height/2, Math.pow(easedWidth*easedLevel*1.5, 1.3));
            }
        }

        rectMode(CENTER);
        noFill();
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
            var y = map(waveform[i], -1, 1, 0, height/2);
            if (trebleEnergy > 130) {
                stroke(0.07, 1, 1); // yellow
            } else {
                stroke(0.95, 1, 1); // red
            }
            vertex(x, y + offset);
        }
        endShape();
    }
}

function togglePlay() {
    if (song.isPlaying()) {
        song.pause();
    } else {
        song.play();
    }
}

// disable scrolling in mobile
// function touchMoved() {
//     return false;
// }
