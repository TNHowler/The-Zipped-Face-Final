//GitHub Copilot has been used to assest the creaton of this code.

const assets = {
  face: null,
  zip: null,
  mouth: null,
  bg: null,
  sound: null,
};

let zipX;
let isDragging = false;
let zipMinX;
let zipMaxX;
let textLines = [];
let draggingText = false;
let offsetX, offsetY;
let wordPositions = [];
let textX, textY;
let showText = true;
let draggableText = "Access Is Important";
let trailingText = "Don't lock your creativity into a format we can't see";
let dragging = false;
let prevMouseX, prevMouseY;
let speed = 0;
let trail = [];
let hasDragged = false;
let letterSpacing = 4;
let customFont;
let zipMovedLeft = false; // Initialize the variable to track if the zip has been moved to the left
let initialZipX;

function mouseDragged() {
  if (isDragging && !zipMovedLeft) {
    zipX = mouseX + offsetX;
    zipX = constrain(zipX, zipMinX, zipMaxX); // Ensure the zip stays within bounds

    // Check if the zip has been moved to the furthest left position
    if (zipX === zipMinX) {
      zipMovedLeft = true;
      isDragging = false; // Stop dragging
      showText = true; // Show the text when the zip is moved to the left
      if (assets.sound) {
        console.log("Playing sound");
        assets.sound.play(); // Play the sound when the zip is moved to the left
      } else {
        console.error("Sound asset is not loaded");
      }
    }
  }

  if (draggingText) {
    textX = mouseX + offsetX;
    textY = mouseY + offsetY;
  }
}

function mouseReleased() {
  isDragging = false;
  draggingText = false;
}

function keyPressed() {
  if (key === 'z') {
    zipMovedLeft = false; // Reset the flag when 'z' is pressed
  }
}

function preload() {
  loadAsset("face", "data/Illustrator_Assets_Face_V2.png");
  loadAsset("mouth", "data/Illustrator_Assets_Mouth_V2.png");
  loadAsset("zip", "data/Illustrator_Assets_Zip_V3.png");
  loadAsset("bg", "data/Illustrator_Assets_BG.png");
  customFont = loadFont('BBB.otf');
  assets.sound = loadSound('data/zip_sound.mp3', soundLoaded, soundLoadError); // Load the MP3 file with callbacks
}

function soundLoaded() {
  console.log("Sound loaded successfully");
}

function soundLoadError(err) {
  console.error("Failed to load sound", err);
}

function loadAsset(name, path) {
  assets[name] = loadImage(
    path,
    img => resizeImage(img),
    err => console.error(`Failed to load ${name}`)
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("white");
  zipX = width / 2;
  initialZipX = zipX; // Store the initial position of the zip
  zipMinX = width / 2 - assets.mouth.width / 4; // Left edge of the mouth
  zipMaxX = width / 2 + assets.mouth.width / 1000; // Right edge of the mouth
  imageMode(CENTER, CENTER);
  textAlign(CENTER, CENTER);
  textFont(customFont);
  textX = width / 1.90;
  textY = height / 1.50;
}

function draw() {
  background("white");
  image(assets.mouth, width / 2, height / 2);
  image(assets.zip, zipX, height / 2);
  image(assets.bg, width / 2, height / 2);
  image(assets.face, width / 2, height / 2);
  
  if (dragging) {
    let dx = mouseX - prevMouseX;
    let dy = mouseY - prevMouseY;
    speed = sqrt(dx * dx + dy * dy);
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    hasDragged = true;
  } else {
    speed = 0;
  }
  
  let totalWidth = textWidth(draggableText) + (draggableText.length - 1) * letterSpacing;
  let startX = textX - totalWidth / 2;

  // Store the current position in the trail array
  if (hasDragged) {
    trail.push({ x: textX, y: textY });

    // Limit the length of the trail
    if (trail.length > 50) {
      trail.shift();
    }

    // Draw the trail with the alternate sentence
    for (let i = 0; i < trail.length; i++) {
      let pos = trail[i];
      let alpha = map(i, 0, trail.length, 0, 255);
      fill(0, 0, 0, alpha);
      let trailingTotalWidth = textWidth(trailingText) + (trailingText.length - 1) * letterSpacing;
      let trailingStartX = pos.x - trailingTotalWidth / 2;
      for (let j = 0; j < trailingText.length; j++) {
        let charX = trailingStartX + textWidth(trailingText.substring(0, j)) + j * letterSpacing;
        let charY = pos.y + sin(j * 0.5) * speed;
        text(trailingText[j], charX, charY);
      }
    }
  }

  // Draw the current text only if the zip has been moved to the left
  if (zipMovedLeft) {
    fill(0);
    textSize(10);
    for (let i = 0; i < draggableText.length; i++) {
      let charX = startX + textWidth(draggableText.substring(0, i)) + i * letterSpacing;
      let charY = textY + sin(i * 0.5) * speed;
      text(draggableText[i], charX, charY);
    }
  }
}

function mousePressed() {
  if (!zipMovedLeft && mouseX > zipX - assets.zip.width / 2 && mouseX < zipX + assets.zip.width / 2 && mouseY > height / 2 - assets.zip.height / 2 && mouseY < height / 2 + assets.zip.height / 2) {
    isDragging = true;
    offsetX = zipX - mouseX;
  }

  if (showText && mouseX > textX - textWidth(draggableText) / 2 && mouseX < textX + textWidth(draggableText) / 2 && mouseY > textY - 16 && mouseY < textY + 16) {
    draggingText = true;
    offsetX = textX - mouseX;
    offsetY = textY - mouseY;
  }
  let d = dist(mouseX, mouseY, textX, textY);
  if (d < textWidth(draggableText) / 2) {
    dragging = true;
    prevMouseX = mouseX;
    prevMouseY = mouseY;
  }
}

function mouseDragged() {
  if (isDragging && !zipMovedLeft) {
    zipX = mouseX + offsetX;
    zipX = constrain(zipX, zipMinX, zipMaxX); // Ensure the zip stays within bounds

    // Check if the zip has been moved to the furthest left position
    if (zipX === zipMinX) {
      zipMovedLeft = true;
      isDragging = false; // Stop dragging
      showText = true; // Show the text when the zip is moved to the left
      assets.sound.play(); // Play the sound when the zip is moved to the left
    }
  }

  if (draggingText) {
    textX = mouseX + offsetX;
    textY = mouseY + offsetY;
  }
}

function mouseReleased() {
  isDragging = false;
  draggingText = false;
}

function keyPressed() {
  if (key === 'z') {
    zipMovedLeft = false; // Reset the flag when 'z' is pressed
  }
}

function resizeImage(img) {
  let aspectRatio = img.width / img.height;
  if (img.width > windowWidth || img.height > windowHeight) {
    if (aspectRatio > 1) {
      img.resize(windowWidth, windowWidth / aspectRatio);
    } else {
      img.resize(windowHeight * aspectRatio, windowHeight);
    }
  }
}
