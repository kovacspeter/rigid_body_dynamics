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

    console.log(this);
    this.canvasElement.click(function(evt) {
      var x = evt.pageX - this.canvasElement.offset().left
      var y = evt.pageY - this.canvasElement.offset().top
      //TODO radius prompt by sa hodilo prerobit na nieco take ze bude tahat
      //  kurzor po canvase a bude sa mu roztahova kruh od bodu kde klikol
      this.canvas.createSphere(new Position(x, y, 0), prompt('Specify radius'));
      this.canvasElement.unbind();
    }.bind(this));

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
