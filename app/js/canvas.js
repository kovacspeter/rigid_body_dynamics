function drawCircle(context, position, radius, color) {
  context.beginPath();
  context.arc(position.x, position.y, radius, 0, 2*Math.PI);
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

function Canvas(canvasElement) {
  //state of canvas can be defined here, are we making sphere? applying force etc..
  this.action = 0;
  this.objects = [];
  this.canvasElement = canvasElement;
  this.context = this.canvasElement[0].getContext("2d");
}

Canvas.prototype.createSphere = function (position, radius) {
  drawCircle(this.context, position, radius, 'black');
  // body...
};

Canvas.prototype.moveObject = function (obj) {
  // body...
};
