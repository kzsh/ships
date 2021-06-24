(function () {
  'use strict';

  const { abs, max, min, random } = Math;
  let id = 2;
  const G = 1;
  const player = {
    id: 1,
    data: {},
    update: (tick, e1, entities, keysDown) => {
      if(!e1) return
      for (const e2 of entities) {
        if(!e2) break;
        if (e1.id !== e2.id) {
          const [w, h, dist] = gravitate(e1, e2);
          bounce(e1, e2, dist, entities);
          e1.data.dist = dist;
          e1.data.h = h;
          e1.data.w = w;

        }
      }
      const ay = keysDown["ArrowDown"]
        ? 0.1
        : keysDown["ArrowUp"]
        ? -0.1
        : 0;
      const ax = keysDown["ArrowLeft"]
        ? -0.1
        : keysDown["ArrowRight"]
        ? 0.1
        : 0;

      e1.dx = e1.dx + ax;
      e1.dy = e1.dy + ay;

      e1.x = e1.x + e1.dx;
      e1.y = e1.y + e1.dy;
    },
    mass: 50,
    radius: 10,
    x: 300,
    y: 300,
    dx: 2,
    dy: 1,
  };
  const makeCircle = (
    x,
    y,
    mass = 1,
    radius = 10,
    dx = Math.random() * 2 -1,
    dy = Math.random() * 2 -1
  ) => ({
    id: id++,
    data: {},
    update: (tick, e1, entities, keysDown) => {
      if(!e1) return

      if(abs(e1.x) > 2000 || abs(e1.y) > 2000 ) {
        destroyEntity(entities, e1);
        return
      }

      if (e1.radius <= 1 && e1.mass <= 0.1){
        destroyEntity(entities, e1);
        return
      }

      for (const e2 of entities) {
        if(!e2) break;
        if (e1.id !== e2.id) {
          const [,, dist] = gravitate(e1, e2);
          bounce(e1, e2, dist, entities);
        }
      }

      e1.x = e1.x + e1.dx;
      e1.y = e1.y + e1.dy;
    },
    mass,
    radius,
    x,
    y,
    dx,
    dy,
  });

  const gravitate = (e1, e2) => {
    const w = (e2.x - e1.x);
    const h = (e2.y - e1.y);
    const distance = getDistance(e1, e2);
    const attraction = newtonsLawOfUniversalGravitation(e1.mass, e2.mass, distance);
    const { x, y } = getAttractionComponents(e1, e2, attraction);
    e1.dx += x;
    e1.dy += y;
    return [w, h, distance]
  };

  const newtonsLawOfUniversalGravitation = (mass1, mass2, distance) => {
   const force = G * ((mass1 * mass2) / distance ** 2) ;
   const attraction1 = force / mass1;
   return attraction1;
  };

  const getDistance = (e1, e2) => {
   const a = Math.abs(e2.x - e1.x);
   const b = Math.abs(e2.y - e1.y);
   return Math.sqrt(a ** 2 + b ** 2);
  };

  const getAttractionComponents = (e1, e2, attraction) => {
    const direction = Math.atan2(e2.x - e1.x, e2.y - e1.y);
    const x = Math.sin(direction) * attraction;
    const y = Math.cos(direction) * attraction;

    return {
      x: x,
      y: y
    }
  };

  const bounce = (e1, e2, dist, entities) => {
    if((dist - e1.radius - e2.radius) <= 0) {
      const distance = getDistance(e1, e2);
      const attraction = newtonsLawOfUniversalGravitation(e1.mass, e2.mass, distance);
      const attraction2 = newtonsLawOfUniversalGravitation(e2.mass, e1.mass, distance);
      const { x: x1, y: y1 } = getAttractionComponents(e1, e2, attraction * -1);
      const { x: x2, y: y2 } = getAttractionComponents(e1, e2, attraction2);
      e1.dx += x1;
      e1.dy += y1;
      e2.dx += x2;
      e2.dy += y2;

      const MASS_EXCHANGE = 0.1;
      const RADIUS_EXCHANGE = 0.1;
      if (e1.mass > e2.mass && e2.mass > 0.01 && e2.radius > 0) {
        transferAttr(e2, e1, 'mass', MASS_EXCHANGE);
        transferAttr(e2, e1, 'radius', RADIUS_EXCHANGE);
        doRandom(0.2, () => {
          e2.mass -= 0.5;
          e2.radius -= 0.1;
          entities.push(
            makeCircle(
              e2.x + e2.radius * 2.5 * random() - e2.radius,
              e2.y + e2.radius * 2.5 * random() - e2.radius,
              e2.mass * 0.01,
              e2.radius * 0.01,
              x1 * -4,
              y1 * -4
            )
          );
        });
      } else if(e1.mass < e2.mass && e1.mass > 0.01 && e1.radius > 0.01) {
        transferAttr(e1, e2, 'mass', MASS_EXCHANGE);
        transferAttr(e1, e2, 'radius', RADIUS_EXCHANGE);
        doRandom(0.9, () => {
          e1.mass -= 0.5;
          e1.radius -= 0.1;
          entities.push(
            makeCircle(
              e1.x + e1.radius * 2.5 * random() - e1.radius,
              e1.y + e1.radius * 2.5 * random() - e1.radius,
              e1.mass * 0.01,
              e1.radius * 0.01,
              x2 * -4,
              y2 * -4
            )
          );
        });
      }

      // if(distance - e2.radius < e1.radius/2) {
      //   destroyEntity(entities, e1)
      // }
      // if(distance - e1.radius < e2.radius/2) {
      //   destroyEntity(entities, e2)
      // }

      // destroySmallEntity(entities, e1)
      // destroySmallEntity(entities, e2)
    }
  };


  const transferAttr = (e1, e2, attr, qty) =>{
    e1[attr] -= qty;
    e2[attr] += qty;
  };

  const doRandom = (threshold, action) => {
    random() < threshold && action();
  };

  const destroyEntity = (entities, e1) => {
    entities[entities.indexOf(e1)] = undefined;
  };

  const createGame = () => {
    const entities = [
      player,
      makeCircle(
        500,
        500,
        1000,
        50
      ),
      makeCircle(
        1000 * Math.random() + 10,
        1000 * Math.random() + 10,
        Math.random() * 30,
        Math.random() * 20
      ),
      makeCircle(
        1000 * Math.random() + 10,
        1000 * Math.random() + 10,
        Math.random() * 30,
        Math.random() * 20
      ),
      makeCircle(
        1000 * Math.random() + 10,
        1000 * Math.random() + 10,
        Math.random() * 30,
        Math.random() * 20
      ),
      makeCircle(
        1000 * Math.random() + 10,
        1000 * Math.random() + 10,
        Math.random() * 30,
        Math.random() * 20
      ),
      makeCircle(
        1000 * Math.random() + 10,
        1000 * Math.random() + 10,
        Math.random() * 30,
        Math.random() * 20
      ),
      makeCircle(
        1000 * Math.random() + 10,
        1000 * Math.random() + 10,
        Math.random() * 30,
        Math.random() * 20
      ),
      makeCircle(
        1000 * Math.random() + 10,
        1000 * Math.random() + 10,
        Math.random() * 30,
        Math.random() * 20
      )
  ];

    const game = {
      entities,
      player
    };

    const update = (tick, keysDown) => {
      // game.entities = game.entities.filter(e => !!e)
      game.entities = game.entities.filter(Boolean);
      // game.entities = game.entities.slice(0, game.entities.indexOf(undefined))
      game.entities.forEach((e) => e?.update(tick, e, game.entities, keysDown));
      return game;
    };

    return [game, update];
  };

  const render = ({ entities }, context) => {
    const len = entities.length;
    const style = context.strokeStyle;

    renderText(context, len, {x:28, y: 28});
    for(let x = 0; x < len; x++) {
      const e = entities[x];
      if(!e) break;

      drawEntity(context, e);

        lineBetweenEntities(context, e, {
          x: e.x + e.dx * 5,
          y: e.y + e.dy * 5
        }, { color: "#F00" });

      if(player && e.id !== player.id) ;
      // renderText(context, e.data.dist?.toFixed(2), {x:e.x + 14, y: e.y})
      renderText(context, e.dx?.toFixed(2), {x:e.x + 14, y: e.y + 14});
      renderText(context, e.dy?.toFixed(2), {x:e.x + 14, y: e.y + 28});
    }
  };


  const drawEntity = (context, e1) => {
    if (e1.radius <=0) return
    const style = context.strokeStyle;
    context.beginPath();
    context.strokeStyle = "#FFF";
    context.arc(e1.x, e1.y, e1.radius, 0, 360);
    context.stroke();
    context.strokeStyle = style;
  };

  const lineBetweenEntities = (context, e1, e2, { color } = {color: "#FFF"}) => {
    const style = context.strokeStyle;
    context.beginPath();
    context.moveTo(e1.x, e1.y);
    context.strokeStyle = color;
    context.lineTo(e2.x, e2.y);
    context.stroke();
    context.strokeStyle = style;
  };

  const renderText = (context, text, { x, y }) => {
    if(text === undefined || text == null) {
      return
    }
    context.beginPath();
    context.font = '14px serif';
    context.strokeStyle = "#FFF";
    context.fillStyle = "#FFF";
    context.fillText(text, x, y);
  };

  const TARGET_FPS = 1000 / 20;
  function initialize() {
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
    ];
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

  initialize();

}());
//# sourceMappingURL=bundle.js.map
