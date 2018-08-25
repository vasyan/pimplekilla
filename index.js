const canvas = document.querySelector(".mount-point");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext("2d");

var background = new Image();
background.src = "skin.jpg";

// Make sure the image is loaded first otherwise nothing will draw.
background.onload = function() {
  context.drawImage(background, 0, 0);
};

// context.globalCompositeOperation = "source-atop";

class PimplesManager {
  static lastSpawnCall = Date.now();
  static spawnPimple(coords) {
    const now = Date.now();

    if (now - this.lastSpawnCall < 1000) {
      return;
    }

    this.lastSpawnCall = now;

    new Circle(coords);
  }
}

class Circle {
  constructor(center) {
    this.x = center[0];
    this.y = center[1];
    this.direction = 0;
    this.radius = 3;
    this.counter = 0;

    this.tick();
  }

  render() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    context.fillStyle = "#fff";
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = "#eee";
    context.stroke();
  }

  getDirection() {
    // return 1;
    return Math.floor(Math.random() + 1);
  }

  tick = () => {
    if (this.counter > 10) {
      this.destroy();
      return;
    }

    this.counter++;
    let direction = this.getDirection();

    // while (direction === this.direction) {
    //   direction = this.getDirection();
    // }

    this.direction = direction;

    var num = Math.floor(Math.random() * 2) + 1; // this will get a number between 1 and 99;
    num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases

    this.y -= 2;
    this.x += num;
    // if (direction <= 1) {
    //   this.y -= 1;
    //   this.x -= 1;
    // } else if (direction > 1) {
    //   this.y -= 1;
    //   this.x += 1;
    // } else if (direction === 2) {
    //   this.x++;
    // } else if (direction === 3) {
    //   this.y++;
    // }

    this.render();
    requestAnimationFrame(this.tick);
  };

  destroy() {
    console.log("destroy call");
  }
}

import ZingTouch from "zingtouch";
import log from "./log";

var regionOne = new ZingTouch.Region(canvas, true, false);
var pinch = new ZingTouch.Pinch({
  // maxDelay: 1000
});
var tap = new ZingTouch.Tap({
  // maxDelay: 1000
});

log("listen events");

regionOne.bind(canvas, pinch, function(e) {
  // preventDefault(e);
  const [fingerOne, fingerTwo] = e.detail.events;

  const middle = [
    (fingerOne.x + fingerTwo.x) / 2,
    (fingerOne.y + fingerTwo.y) / 2
  ];
  // const middle = [fingerOne.x, fingerOne.y];
  const distance = Math.sqrt(
    Math.pow(
      2,
      Math.max(fingerTwo.x, fingerTwo.x) - Math.max(fingerOne.x, fingerTwo.x)
    ) +
      Math.pow(
        2,
        Math.max(fingerOne.y, fingerTwo.y) - Math.min(fingerOne.y, fingerTwo.y)
      )
  );

  console.log("distance", distance);
  // log(middle);

  // drawCircle(middle);
  if (distance && distance < 50) {
    PimplesManager.spawnPimple(middle);
  }
  // new Circle(middle);
  // log("tapped!" + e);
  // var textElement = document.getElementById("one");
  // textElement.innerHTML = "Tapped!";
  // setOutput([
  //   ["Gesture", "Tap"],
  //   ["inputs", "1"],
  //   ["interval", Math.floor(e.detail.interval) + "ms"]
  // ]);

  // (function(element) {
  //   setTimeout(function() {
  //     element.innerHTML = "One Finger Tap";
  //   }, 1000);
  // })(textElement);
});
