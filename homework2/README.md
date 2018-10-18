# Homework 2: Music Visualizer
## Inspirations and Acknowledgments
I have used the code in the [FFT reference](https://p5js.org/reference/#/p5.FFT) as basis.

I have taken the smoothing function for the waveform from [FFT Scale by 1/3 Octave](https://therewasaguy.github.io/p5-music-viz/demos/05_fft_scaleOneThirdOctave/)

Furthermore I was mostly inspired by the Atari Video Music and the circular spectrum we saw in the lecture.

Spotify Echo Nest API is used.

The song, **Horizon Ending** by **_Soft and Furious_** is available at both [spotify](https://open.spotify.com/track/44VL19FcmzJKeNRhumAjE9?si=eqHoMMcqTrm5LWg-GAmjAQ) and [free music archive](http://freemusicarchive.org/music/Soft_and_Furious/You_know_where_to_find_me/Soft_and_Furious_-_You_know_where_to_find_me_-_09_Horizon_Ending)

## Visualized features
I have used segments from the Spotify song analysis to change the color randomly. I was planning to use more features, but I didn't want to clutter. Additionally a treble threshold is used to decide when to draw the grid and the waveform. The waveforms are in two colors that and make up a triad color scheme with the random background color. I have used simple animation easing.
