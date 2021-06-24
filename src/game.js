import { makeCircle, player } from './entities'
export const createGame = () => {
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
]

  const game = {
    entities,
    player
  };

  const update = (tick, keysDown) => {
    // game.entities = game.entities.filter(e => !!e)
    game.entities = game.entities.filter(Boolean)
    // game.entities = game.entities.slice(0, game.entities.indexOf(undefined))
    game.entities.forEach((e) => e?.update(tick, e, game.entities, keysDown));
    return game;
  };

  return [game, update];
};
