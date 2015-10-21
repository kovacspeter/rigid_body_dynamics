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
  this.action = false;
  this.objects = [];
  this.canvasElement = canvasElement;
  this.initClickListener();
  this.context = this.canvasElement[0].getContext("2d");
}

Canvas.prototype.createSphere = function (position, radius) {
  this.objects.push(new Sphere(position, radius));
  drawCircle(this.context, position, radius, 'black');
};

Canvas.prototype.moveObject = function (obj) {
  // body...
};

Canvas.prototype.act = function (evt) {
  switch (this.action) {

    case "createSphere":
      var x = evt.pageX - this.canvasElement.offset().left
      var y = evt.pageY - this.canvasElement.offset().top
      //TODO radius prompt by sa hodilo prerobit na nieco take ze bude tahat
      //  kurzor po canvase a bude sa mu roztahova kruh od bodu kde klikol
      this.createSphere(new Position(x, y, 0), prompt('Specify radius'));
      this.action = false;
      break;

    case "moveSphere":
    //TODO
    break;

    case "deleteSphere":
    //TODO
    break;

    case "applyForce":
    //TODO
    break;

    default:
    //TODO
  };
};

Canvas.prototype.initClickListener = function () {
  this.canvasElement.click(function(evt){
    this.act(evt);
  }.bind(this));
};
