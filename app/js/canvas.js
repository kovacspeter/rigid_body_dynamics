function drawCircle(context, x, y, radius, color) {
  context.beginPath();
  context.arc(x, y, radius, 0, 2*Math.PI);
  context.fillStyle = color;
  context.fill();
  context.stroke();
}

function drawLine(context, fromPosition, toPosition, color, width) {
    context.beginPath();
    context.lineWidth = width;
    context.strokeStyle = color;
    context.moveTo(fromPosition[0], fromPosition[1]);
    context.lineTo(toPosition[0], toPosition[1]);
    context.stroke();
}
