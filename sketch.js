let bodySegmentation;
let video;
let segmentation;
let fgImg;
let bgImg;


const options = {
  
  flipped: true  // 👈 this flips the video + mask horizontally
};

function preload() {
  bodySegmentation = ml5.bodySegmentation("BodyPix", options);
  fgImg = loadImage("foregroundpattern.png");
  bgImg = loadImage("backgroundpattern.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight); // fills browser window
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();

  bodySegmentation.detectStart(video, gotResults);
}

function draw() {
  background(0,244,33);
  image(bgImg, 0, 0, width, height);

  if (segmentation) {
    // Convert HTMLImageElement to p5.Image
    let pg = createGraphics(segmentation.mask.width, segmentation.mask.height);
    pg.image(segmentation.mask, 0, 0);
    let maskImg = pg.get(); // now it's a p5.Image
    maskImg.loadPixels();

    // Make copy of foreground and mask it
    let fgLayer = fgImg.get();
    fgLayer.mask(maskImg);
    image(fgLayer, 0, 0, width, height);

    // Invert the mask for background
    let invertedMask = createImage(maskImg.width, maskImg.height);
    invertedMask.loadPixels();
    for (let i = 0; i < maskImg.pixels.length; i += 4) {
      let val = maskImg.pixels[i]; // grayscale value
      let inv = 255 - val;
      invertedMask.pixels[i] = inv;
      invertedMask.pixels[i + 1] = inv;
      invertedMask.pixels[i + 2] = inv;
      invertedMask.pixels[i + 3] = 255;
    }
    invertedMask.updatePixels();

    // Make copy of background and mask it with inverted mask
    let bgLayer = bgImg.get();
    bgLayer.mask(invertedMask);
    //image(bgLayer, 0, 0, width, height);
  }
}

function gotResults(result) {
  segmentation = result;
}
