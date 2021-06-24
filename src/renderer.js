
import { player } from "./entities"

export const render = ({ entities }, context) => {
  const len = entities.length;
  const style = context.strokeStyle;

  renderText(context, len, {x:28, y: 28})
  for(let x = 0; x < len; x++) {
    const e = entities[x];
    if(!e) break;

    drawEntity(context, e)

      lineBetweenEntities(context, e, {
        x: e.x + e.dx * 5,
        y: e.y + e.dy * 5
      }, { color: "#F00" })

    if(player && e.id !== player.id) {
      // lineBetweenEntities(context, e, player)


      // lineBetweenEntities(context, player, {
      //   x: player.x + e.data.w,
      //   y: player.y
      // })
      // lineBetweenEntities(context, player, {
      //   x: player.x,
      //   y: player.y + e.data.h
      // })
    }
    // renderText(context, e.data.dist?.toFixed(2), {x:e.x + 14, y: e.y})
    renderText(context, e.dx?.toFixed(2), {x:e.x + 14, y: e.y + 14})
    renderText(context, e.dy?.toFixed(2), {x:e.x + 14, y: e.y + 28})
  }
}


const drawEntity = (context, e1) => {
  if (e1.radius <=0) return
  const style = context.strokeStyle;
  context.beginPath();
  context.strokeStyle = "#FFF";
  context.arc(e1.x, e1.y, e1.radius, 0, 360);
  context.stroke();
  context.strokeStyle = style;
}

const lineBetweenEntities = (context, e1, e2, { color } = {color: "#FFF"}) => {
  const style = context.strokeStyle;
  context.beginPath()
  context.moveTo(e1.x, e1.y)
  context.strokeStyle = color;
  context.lineTo(e2.x, e2.y)
  context.stroke()
  context.strokeStyle = style;
}

const renderText = (context, text, { x, y }) => {
  if(text === undefined || text == null) {
    return
  }
  context.beginPath()
  context.font = '14px serif';
  context.strokeStyle = "#FFF";
  context.fillStyle = "#FFF";
  context.fillText(text, x, y)
}
