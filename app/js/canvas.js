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

Canvas.prototype.createSphere = function (evt) {
  var x = evt.pageX - this.canvasElement.offset().left
  var y = evt.pageY - this.canvasElement.offset().top
  //TODO radius prompt by sa hodilo prerobit na nieco take ze bude tahat
  //  kurzor po canvase a bude sa mu roztahova kruh od bodu kde klikol
  this.objects.push(new Sphere(new Position(x, y, 0), prompt('Specify radius')));
};

Canvas.prototype.moveSphere = function (evt) {
  // body...
};

Canvas.prototype.applyForce = function (evt) {
  // body...
};

Canvas.prototype.deleteSphere = function (evt) {
  var x = evt.pageX - this.canvasElement.offset().left
  var y = evt.pageY - this.canvasElement.offset().top
  var pos = new Position(x,y,0);
  for (i in this.objects) {
    if (this.objects[i].isInSphere(pos)) {
       this.objects.splice(i, 1);
       break;
    }
  }
};

Canvas.prototype.act = function (evt) {
  switch (this.action) {

    case "createSphere":
      this.createSphere(evt);
      break;

    case "moveSphere":
      this.moveSphere(evt);
      break;

    case "deleteSphere":
      this.deleteSphere(evt);
      break;

    case "applyForce":
      this.applyForce(evt);
      break;

    default:
      //TODO
  };

  this.action = false;
  this.render();
};

Canvas.prototype.render = function () {
  console.log(this.objects);
  this.context.clearRect(0, 0, this.canvasElement[0].width, this.canvasElement[0].height);
  for (var i = 0; i < this.objects.length; i++) {
      drawCircle(this.context, this.objects[i].position, this.objects[i].radius, 'black');
  }
};

Canvas.prototype.initClickListener = function () {
  this.canvasElement.click(function(evt){
    this.act(evt);
  }.bind(this));
};
