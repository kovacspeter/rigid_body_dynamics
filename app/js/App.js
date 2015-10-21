function init(canvas, menu) {
  new App($('#' + canvas), $('#' + menu))
};

function App(canvasElement, menu) {
  this.menu = menu;
  this.canvasElement = canvasElement;
  this.canvas = new Canvas(canvasElement);
  this.control = this.initControls(this.menu);
};

App.prototype.initControls = function(where) {

  this.createButton(where, 'Create Sphere', 'createSphere', function() {
    this.canvas.action = "createSphere";
  }.bind(this));
};

App.prototype.createButton = function(where, text, id, func){
  var button = $("<button/>", {
    id: id,
    text: text,
    click: func
  });

  where.append(button);
  return button;
}
