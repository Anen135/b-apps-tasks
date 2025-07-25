export function drawTextBlock(ctx, block, offset, zoom) {
  const { x, y, text, color, textColor } = block

  ctx.save()
  ctx.translate(offset.x, offset.y)
  ctx.scale(zoom, zoom)

  ctx.fillStyle = color
  ctx.fillRect(x, y, 150, 50)

  ctx.fillStyle = textColor || '#000000'
  ctx.font = '16px Arial'
  ctx.fillText(text, x + 10, y + 30)

  ctx.restore()
}
