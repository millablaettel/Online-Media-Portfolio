let sound;
let objs = [];
let objsNum = 360;
const noiseScale = 0.01;
let R;
let maxR;
let t = 0;
let nt = 0;
let nR = 0;
let nTheta = 1000;
const palette = ["#D9183B", "#F21D81", "#1F26A6", "#B4F257"];

function preload() {
  soundFormats('mp3', 'ogg');
  sound = loadSound('backgroundmusic.mp3', soundLoaded, loadError);
}

function soundLoaded() {
  console.log('Sound loaded successfully');
}

function loadError(err) {
  console.error('Error loading sound: ', err);
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  noStroke();

  maxR = max(width, height) * 0.45;

  background(20);
  
  if (sound.isLoaded()) {
    sound.play();
  }
       
}

function draw() {
  let R = map(noise(nt * 0.01, nR), 0, 1, 0, maxR);
  let t = map(noise(nt * 0.001, nTheta), 0, 1, -360, 360);
  let x = R * cos(t) + width / 2;
  let y = R * sin(t) + height / 2;
  objs.push(new Obj(x, y));

  if (mouseIsPressed) {
    objs.push(new Obj(mouseX, mouseY));
  }

  for (let i = 0; i < objs.length; i++) {
    objs[i].move();
    objs[i].display();
  }

  for (let j = objs.length - 1; j >= 0; j--) {
    if (objs[j].isFinished()) {
      objs.splice(j, 1);
    }
  }

  nt++;
}

class Obj {
  constructor(ox, oy) {
    this.init(ox, oy);
  }

  init(ox, oy) {
    this.vel = createVector(0, 0);
    this.pos = createVector(ox, oy);
    this.t = random(0, noiseScale);
    this.lifeMax = random(20, 50);
    this.life = this.lifeMax;
    this.step = random(0.1, 0.5);
    this.dMax = random(10) >= 5 ? 10 : 30;
    this.d = this.dMax;
    this.c = color(random(palette));
  }

  move() {
    let theta = map(noise(this.pos.x * noiseScale, this.pos.y * noiseScale, this.t), 0, 1, -360, 360);
    this.vel.x = cos(theta);
    this.vel.y = sin(theta);
    this.pos.add(this.vel);
  }

  isFinished() {
    this.life -= this.step;
    this.d = map(this.life, 0, this.lifeMax, 0, this.dMax);
    if (this.life < 0) {
      return true;
    } else {
      return false;
    }
  }

  display() {
    fill(this.c);
    circle(this.pos.x, this.pos.y, this.d);
  }
}

function func(t, num) {
  let a = 360 / num;
  let A = cos(a);
  let b = acos(cos(num * t));
  let B = cos(a - b / num);

  return A / B;
}
