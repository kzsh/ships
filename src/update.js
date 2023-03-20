import { createGame } from "./game";
import { render } from "./renderer";
const TARGET_FPS = 1000 / 20;

export function initialize() {
  const keysDown = {};
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const context = canvas.getContext("2d");
  document.body.appendChild(canvas);

  const [game, update] = createGame();

  let lastTime = 0;
  let lastRender = 0;

  const performFrame = (time = 0) => {
    const tick = time - lastTime;

    lastRender = lastRender + tick;
    if (lastRender > TARGET_FPS) {
      update(tick, keysDown);
      context.clearRect(0, 0, canvas.width, canvas.height);
      render(game, context);
      lastRender = 0;
    }

    lastTime = time;
    window.requestAnimationFrame(performFrame);
  };
  const KEYS = [
    "ArrowDown",
    "ArrowUp",
    "ArrowLeft",
    "ArrowRight"
  ]
  document.addEventListener("keydown", (e) => {
    if(KEYS.includes(e.key)) {
      e.preventDefault();
      keysDown[e.key] = true;
    }
  });
  document.addEventListener("keyup", (e) => {
    if(KEYS.includes(e.key)) {
      e.preventDefault();
      keysDown[e.key] = false;
    }
  });

  performFrame();
}
