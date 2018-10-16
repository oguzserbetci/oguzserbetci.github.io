var song;
var second;
var el_width;
var offset = 0;

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
        sum = this.reduce(function(a, b) { return a + b; });
        avg = sum / this.length;
        return avg;
    } else {
        return 0;
    }
}

function preload(){
    //song = loadSound('01 Thousand Knives.m4a');
    song = loadSound('Soft_and_Furious_-_09_-_Horizon_Ending.mp3');
}

function setup(){
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.mouseClicked(togglePlay);
    fft = new p5.FFT();
    easedMouseX = mouseX;
    easedMouseY = mouseY;
    amplitude = new p5.Amplitude();
    bgColor = color(10,10,10);
    checkSpotify(true);
    el_width = 0;
}

function popSpotifyVariable(varName){
    popped = horizon_analysis[varName][0];
    horizon_analysis[varName].shift();
    return popped;
}

function randomBg(){
    colorMode(HSB, 1);
    bgColor = color(random(1), 1, 0.2);
    colorMode(RGB,255);
    background(bgColor);
}

//watched variables
var spotifyVariables = ["bars", "beats", "sections", "segments", "tatums"];
var spotifyCallbacks = {"tatums": function(popped) {el_width = Math.pow(popped.duration,-2);},
                        "segments": function(popped) {randomBg();
                                                      offset = 0;}};
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

function draw(){
    if (song.isPlaying()) {
    second = song.currentTime();

    level = amplitude.getLevel();
    left_level = amplitude.getLevel(0);
    right_level = amplitude.getLevel(1);

    // mouse easing
    targetX = mouseX;
    dx = targetX - easedMouseX;
    easedMouseX += dx * easing;

    targetY = mouseY;
    dy = targetY - easedMouseY;
    easedMouseY += dy * easing;

    if (level > 0.3) {
       // randomBg(c)
    }
    bgColor.setAlpha(0.1)
    background(bgColor);

    checkSpotify(false)

    noFill();
    fill(0, 255, 0, 0.1)
    dx = left_level - eased_left_level
    eased_left_level += dx

    dx = right_level - eased_right_level
    eased_right_level += dx

    ellipse(0, height-easedMouseY, map(eased_left_level, 0, 1, 100, width))
    ellipse(width, height-easedMouseY, map(eased_right_level, 0, 1, 100, width))

    el_width += 100
    ellipse(width/2, height-easedMouseY, el_width)

    var spectrum = fft.analyze();

    //noStroke();
    //fill(0,255,0); // spectrum is green
    //for (var i = 0; i< spectrum.length; i++){
        //var x = map(i, 0, spectrum.length, 0, width);
        //var h = -height + map(spectrum[i], 0, 255, height, 0);
        //rect(x, height, width / spectrum.length, h );
    //}


    var waveform = fft.waveform();
    fft.smooth(0.1);
    noFill();
    beginShape();
    stroke(255,0,0); // waveform is red
    strokeWeight(1);
    for (var i = 0; i< waveform.length; i++){
        var x = map(i, 0, waveform.length, 0, width);
        var y = map( waveform[i], -1, 1, easedMouseY-(height/2), easedMouseY+(height/2));
        vertex(x,y+offset);
    }
    offset += 100;
    endShape();

    stroke(255,255,255); // waveform is red
    text('click to play/pause', 4, 10);

    stroke(255);
    // quadAtPoint(easedMouseX, easedMouseY, Math.pow(spectrum.mean(),1.7), spectrum.max());
    // quadAtPoint(easedMouseX, easedMouseY, Math.pow(spectrum.mean(),1.5), spectrum.max());
    // quadAtPoint(easedMouseX, easedMouseY, Math.pow(spectrum.mean(),1.3), spectrum.max());
    // quadAtPoint(easedMouseX, easedMouseY, spectrum.mean(), spectrum.max());
    }
}

function togglePlay(){
    if (song.isPlaying()) {
        song.pause()
    } else {
        song.play()
    }
}

function quadAtPoint(x, y, width, height){
    x1 = x-(width/2);
    x2 = x+(width/2);
    y1 = y-(height/2);
    y2 = y+(height/2);
    quad(x1, y, x, y1, x2, y, x, y2);
}

function patternAtPoint(x,y) {}

// disable scrolling in mobile
function touchMoved() {
    return false;
}


